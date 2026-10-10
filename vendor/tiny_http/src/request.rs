use std::io::Error as IoError;
use std::io::Result as IoResult;
use std::io::{self, Cursor, ErrorKind, Read, Write};

use std::fmt;
use std::net::SocketAddr;
use std::str::FromStr;

use std::sync::mpsc::Sender;

use crate::util::{EqualReader, FusedReader, ReadTimeout, ReadTimeoutLease};
use crate::{HTTPVersion, Header, Method, Response, StatusCode};
use chunked_transfer::Decoder;
use std::time::Duration;

/// Represents an HTTP request made by a client.
///
/// A `Request` object is what is produced by the server, and is your what
/// your code must analyse and answer.
///
/// This object implements the `Send` trait, therefore you can dispatch your requests to
/// worker threads.
///
/// # Pipelining
///
/// If a client sends multiple requests in a row (without waiting for the response), then you will
/// get multiple `Request` objects simultaneously. This is called *requests pipelining*.
/// Tiny-http automatically reorders the responses so that you don't need to worry about the order
/// in which you call `respond` or `into_writer`.
///
/// This mechanic is disabled if:
///
///  - The body of a request is large enough (handling requires pipelining requires storing the
///    body of the request in a buffer ; if the body is too big, tiny-http will avoid doing that)
///  - A request sends a `Expect: 100-continue` header (which means that the client waits to
///    know whether its body will be processed before sending it)
///  - A request sends a `Connection: close` header or `Connection: upgrade` header (used for
///    websockets), which indicates that this is the last request that will be received on this
///    connection
///
/// # Automatic cleanup
///
/// If a `Request` object is destroyed without `into_writer` or `respond` being called,
/// an empty response with a 500 status code (internal server error) will automatically be
/// sent back to the client.
/// This means that if your code fails during the handling of a request, this "internal server
/// error" response will automatically be sent during the stack unwinding.
///
/// # Testing
///
/// If you want to build fake requests to test your server, use [`TestRequest`](crate::test::TestRequest).
pub struct Request {
    // where to read the body from
    data_reader: Option<Box<dyn Read + Send + 'static>>,

    // if this writer is empty, then the request has been answered
    response_writer: Option<Box<dyn Write + Send + 'static>>,

    remote_addr: Option<SocketAddr>,

    // true if HTTPS, false if HTTP
    secure: bool,

    method: Method,

    path: String,

    http_version: HTTPVersion,

    headers: Vec<Header>,

    body_length: Option<usize>,

    // true when reading the body can wait on the client socket
    body_can_block: bool,

    // true if a `100 Continue` response must be sent when `as_reader()` is called
    must_send_continue: bool,

    // If Some, a message must be sent after responding
    notify_when_responded: Option<Sender<()>>,

    read_timeout: Option<ReadTimeout>,

    // The body reader and this request share the lease. The reader clears it
    // before it releases a streaming connection to a pipelined request.
    body_timeout: Option<ReadTimeoutLease>,

}

struct NotifyOnDrop<R> {
    sender: Sender<()>,
    inner: R,
}

struct ClearTimeoutOnEof<R> {
    inner: R,
    body_timeout: ReadTimeoutLease,
}

impl<R> ClearTimeoutOnEof<R> {
    fn new(inner: R, body_timeout: ReadTimeoutLease) -> Self {
        Self {
            inner,
            body_timeout,
        }
    }
}

impl<R: Read> Read for ClearTimeoutOnEof<R> {
    fn read(&mut self, buf: &mut [u8]) -> io::Result<usize> {
        let read = self.inner.read(buf)?;
        if read == 0 {
            self.body_timeout.complete()?;
        }
        Ok(read)
    }
}

fn clear_timeout_on_eof<R>(
    reader: R,
    body_timeout: Option<ReadTimeoutLease>,
) -> Box<dyn Read + Send + 'static>
where
    R: Read + Send + 'static,
{
    match body_timeout {
        Some(body_timeout) => Box::new(ClearTimeoutOnEof::new(reader, body_timeout)),
        None => Box::new(reader),
    }
}

impl<R: Read> Read for NotifyOnDrop<R> {
    fn read(&mut self, buf: &mut [u8]) -> io::Result<usize> {
        self.inner.read(buf)
    }
}
impl<R: Write> Write for NotifyOnDrop<R> {
    fn write(&mut self, buf: &[u8]) -> io::Result<usize> {
        self.inner.write(buf)
    }
    fn flush(&mut self) -> io::Result<()> {
        self.inner.flush()
    }
}
impl<R> Drop for NotifyOnDrop<R> {
    fn drop(&mut self) {
        self.sender.send(()).unwrap();
    }
}

/// Error that can happen when building a `Request` object.
#[derive(Debug)]
pub enum RequestCreationError {
    /// The client sent an `Expect` header that was not recognized by tiny-http.
    ExpectationFailed,

    /// Error while reading data from the socket during the creation of the `Request`.
    CreationIoError(IoError),
}

impl From<IoError> for RequestCreationError {
    fn from(err: IoError) -> RequestCreationError {
        RequestCreationError::CreationIoError(err)
    }
}

/// Builds a new request.
///
/// After the request line and headers have been read from the socket, a new `Request` object
/// is built.
///
/// You must pass a `Read` that will allow the `Request` object to read from the incoming data.
/// It is the responsibility of the `Request` to read only the data of the request and not further.
///
/// The `Write` object will be used by the `Request` to write the response.
#[allow(clippy::too_many_arguments)]
pub fn new_request<R, W>(
    secure: bool,
    method: Method,
    path: String,
    version: HTTPVersion,
    headers: Vec<Header>,
    remote_addr: Option<SocketAddr>,
    mut source_data: R,
    writer: W,
    read_timeout: Option<ReadTimeout>,
) -> Result<Request, RequestCreationError>
where
    R: Read + Send + 'static,
    W: Write + Send + 'static,
{
    // finding the transfer-encoding header
    let transfer_encoding = headers
        .iter()
        .find(|h: &&Header| h.field.equiv("Transfer-Encoding"))
        .map(|h| h.value.clone());

    // finding the content-length header
    let content_length = if transfer_encoding.is_some() {
        // if transfer-encoding is specified, the Content-Length
        // header must be ignored (RFC2616 #4.4)
        None
    } else {
        headers
            .iter()
            .find(|h: &&Header| h.field.equiv("Content-Length"))
            .and_then(|h| FromStr::from_str(h.value.as_str()).ok())
    };

    // true if the client sent a `Expect: 100-continue` header
    let expects_continue = {
        match headers
            .iter()
            .find(|h: &&Header| h.field.equiv("Expect"))
            .map(|h| h.value.as_str())
        {
            None => false,
            Some(v) if v.eq_ignore_ascii_case("100-continue") => true,
            _ => return Err(RequestCreationError::ExpectationFailed),
        }
    };

    // true if the client sent a `Connection: upgrade` header
    let connection_upgrade = {
        match headers
            .iter()
            .find(|h: &&Header| h.field.equiv("Connection"))
            .map(|h| h.value.as_str())
        {
            Some(v) if v.to_ascii_lowercase().contains("upgrade") => true,
            _ => false,
        }
    };

    let body_can_block = connection_upgrade
        || transfer_encoding.is_some()
        || content_length.is_some_and(|length| length > 0 && (length > 1024 || expects_continue));
    let body_timeout = body_can_block
        .then(|| read_timeout.as_ref().map(ReadTimeout::lease))
        .flatten();

    // we wrap `source_data` around a reading whose nature depends on the transfer-encoding and
    // content-length headers
    let reader = if connection_upgrade {
        // if we have a `Connection: upgrade`, always keeping the whole reader
        clear_timeout_on_eof(source_data, body_timeout.clone())
    } else if let Some(content_length) = content_length {
        if content_length == 0 {
            Box::new(io::empty()) as Box<dyn Read + Send + 'static>
        } else if content_length <= 1024 && !expects_continue {
            // if the content-length is small enough, we just read everything into a buffer

            let mut buffer = vec![0; content_length];
            let mut offset = 0;

            while offset != content_length {
                let read = source_data.read(&mut buffer[offset..])?;
                if read == 0 {
                    // the socket returned EOF, but we were before the expected content-length
                    // aborting
                    let info = "Connection has been closed before we received enough data";
                    let err = IoError::new(ErrorKind::ConnectionAborted, info);
                    return Err(RequestCreationError::CreationIoError(err));
                }

                offset += read;
            }

            Box::new(Cursor::new(buffer)) as Box<dyn Read + Send + 'static>
        } else {
            let (data_reader, _) = EqualReader::new(source_data, content_length); // TODO:
            Box::new(FusedReader::new(clear_timeout_on_eof(
                data_reader,
                body_timeout.clone(),
            ))) as Box<dyn Read + Send + 'static>
        }
    } else if transfer_encoding.is_some() {
        // if a transfer-encoding was specified, then "chunked" is ALWAYS applied
        // over the message (RFC2616 #3.6)
        Box::new(FusedReader::new(clear_timeout_on_eof(
            Decoder::new(source_data),
            body_timeout.clone(),
        ))) as Box<dyn Read + Send + 'static>
    } else {
        // if we have neither a Content-Length nor a Transfer-Encoding,
        // assuming that we have no data
        // TODO: could also be multipart/byteranges
        Box::new(io::empty()) as Box<dyn Read + Send + 'static>
    };

    Ok(Request {
        data_reader: Some(reader),
        response_writer: Some(Box::new(writer) as Box<dyn Write + Send + 'static>),
        remote_addr,
        secure,
        method,
        path,
        http_version: version,
        headers,
        body_length: content_length,
        body_can_block,
        must_send_continue: expects_continue,
        notify_when_responded: None,
        read_timeout,
        body_timeout,
    })
}

impl Request {
    /// Returns true if the request was made through HTTPS.
    #[inline]
    pub fn secure(&self) -> bool {
        self.secure
    }

    /// Returns the method requested by the client (eg. `GET`, `POST`, etc.).
    #[inline]
    pub fn method(&self) -> &Method {
        &self.method
    }

    /// Returns the resource requested by the client.
    #[inline]
    pub fn url(&self) -> &str {
        &self.path
    }

    /// Returns a list of all headers sent by the client.
    #[inline]
    pub fn headers(&self) -> &[Header] {
        &self.headers
    }

    /// Returns the HTTP version of the request.
    #[inline]
    pub fn http_version(&self) -> &HTTPVersion {
        &self.http_version
    }

    /// Returns the length of the body in bytes.
    ///
    /// Returns `None` if the length is unknown.
    #[inline]
    pub fn body_length(&self) -> Option<usize> {
        self.body_length
    }

    /// Returns whether reading this request body can wait for more client data.
    #[inline]
    pub fn body_can_block(&self) -> bool {
        self.body_can_block
    }

    /// Returns the address of the client that sent this request.
    ///
    /// The address is always `Some` for TCP listeners, but always `None` for UNIX listeners
    /// (as the remote address of a UNIX client is almost always unnamed).
    ///
    /// Note that this is gathered from the socket. If you receive the request from a proxy,
    /// this function will return the address of the proxy and not the address of the actual
    /// user.
    #[inline]
    pub fn remote_addr(&self) -> Option<&SocketAddr> {
        self.remote_addr.as_ref()
    }

    /// Sends a response with a `Connection: upgrade` header, then turns the `Request` into a `Stream`.
    ///
    /// The main purpose of this function is to support websockets.
    /// If you detect that the request wants to use some kind of protocol upgrade, you can
    ///  call this function to obtain full control of the socket stream.
    ///
    /// If you call this on a non-websocket request, tiny-http will wait until this `Stream` object
    ///  is destroyed before continuing to read or write on the socket. Therefore you should always
    ///  destroy it as soon as possible.
    pub fn upgrade<R: Read>(
        mut self,
        protocol: &str,
        response: Response<R>,
    ) -> Box<dyn ReadWrite + Send> {
        use crate::util::CustomStream;

        response
            .raw_print(
                self.response_writer.as_mut().unwrap().by_ref(),
                self.http_version.clone(),
                &self.headers,
                false,
                Some(protocol),
            )
            .ok(); // TODO: unused result

        self.response_writer.as_mut().unwrap().flush().ok(); // TODO: unused result

        let stream = CustomStream::new(self.extract_reader_impl(), self.extract_writer_impl());
        if let Some(sender) = self.notify_when_responded.take() {
            let stream = NotifyOnDrop {
                sender,
                inner: stream,
            };
            Box::new(stream) as Box<dyn ReadWrite + Send>
        } else {
            Box::new(stream) as Box<dyn ReadWrite + Send>
        }
    }

    /// Allows to read the body of the request.
    ///
    /// # Example
    ///
    /// ```no_run
    /// # extern crate rustc_serialize;
    /// # extern crate tiny_http;
    /// # use rustc_serialize::json::Json;
    /// # use std::io::Read;
    /// # fn get_content_type(_: &tiny_http::Request) -> &'static str { "" }
    /// # fn main() {
    /// # let server = tiny_http::Server::http("0.0.0.0:0").unwrap();
    /// let mut request = server.recv().unwrap();
    ///
    /// if get_content_type(&request) == "application/json" {
    ///     let mut content = String::new();
    ///     request.as_reader().read_to_string(&mut content).unwrap();
    ///     let json: Json = content.parse().unwrap();
    /// }
    /// # }
    /// ```
    ///
    /// If the client sent a `Expect: 100-continue` header with the request, calling this
    ///  function will send back a `100 Continue` response.
    #[inline]
    pub fn as_reader(&mut self) -> &mut dyn Read {
        if self.must_send_continue {
            let msg = Response::new_empty(StatusCode(100));
            msg.raw_print(
                self.response_writer.as_mut().unwrap().by_ref(),
                self.http_version.clone(),
                &self.headers,
                true,
                None,
            )
            .ok();
            self.response_writer.as_mut().unwrap().flush().ok();
            self.must_send_continue = false;
        }

        self.data_reader.as_mut().unwrap()
    }

    /// Applies an inactivity timeout while this request body is read.
    ///
    /// The timeout affects incoming bytes only. Callers should clear it after
    /// consuming the body so idle keep-alive connections are not timed out.
    /// Dropping a request does not clear it, because a later request on the
    /// same connection may already have armed its own timeout.
    pub fn set_body_read_timeout(&mut self, timeout: Option<Duration>) -> IoResult<()> {
        if let Some(body_timeout) = &self.body_timeout {
            match timeout {
                Some(timeout) => match body_timeout.arm(timeout) {
                    Ok(()) => Ok(()),
                    Err(error) => Err(error),
                },
                None => body_timeout.clear(),
            }
        } else {
            Ok(())
        }
    }

    /// Stops consuming this request body and closes its incoming stream.
    ///
    /// This lets an incomplete streaming body be dropped without waiting for
    /// its remaining bytes, while leaving the response writer available.
    pub fn abort_body(&mut self) {
        if let Some(read_timeout) = &mut self.read_timeout {
            let result = if let Some(body_timeout) = &self.body_timeout {
                match body_timeout.abort() {
                    Ok(true) | Err(_) => read_timeout.abort(),
                    Ok(false) => Ok(()),
                }
            } else {
                Ok(())
            };
            let _ = result;
        }
    }

    /// Turns the `Request` into a writer.
    ///
    /// The writer has a raw access to the stream to the user.
    /// This function is useful for things like CGI.
    ///
    /// Note that the destruction of the `Writer` object may trigger
    /// some events. For exemple if a client has sent multiple requests and the requests
    /// have been processed in parallel, the destruction of a writer will trigger
    /// the writing of the next response.
    /// Therefore you should always destroy the `Writer` as soon as possible.
    #[inline]
    pub fn into_writer(mut self) -> Box<dyn Write + Send + 'static> {
        let writer = self.extract_writer_impl();
        if let Some(sender) = self.notify_when_responded.take() {
            let writer = NotifyOnDrop {
                sender,
                inner: writer,
            };
            Box::new(writer) as Box<dyn Write + Send + 'static>
        } else {
            writer
        }
    }

    /// Extract the response `Writer` object from the Request, dropping this `Writer` has the same side effects
    /// as the object returned by `into_writer` above.
    ///
    /// This may only be called once on a single request.
    fn extract_writer_impl(&mut self) -> Box<dyn Write + Send + 'static> {
        use std::mem;

        assert!(self.response_writer.is_some());

        let mut writer = None;
        mem::swap(&mut self.response_writer, &mut writer);
        writer.unwrap()
    }

    /// Extract the body `Reader` object from the Request.
    ///
    /// This may only be called once on a single request.
    fn extract_reader_impl(&mut self) -> Box<dyn Read + Send + 'static> {
        use std::mem;

        assert!(self.data_reader.is_some());

        let mut reader = None;
        mem::swap(&mut self.data_reader, &mut reader);
        reader.unwrap()
    }

    /// Sends a response to this request.
    #[inline]
    pub fn respond<R>(mut self, response: Response<R>) -> Result<(), IoError>
    where
        R: Read,
    {
        let res = self.respond_impl(response);
        if let Some(sender) = self.notify_when_responded.take() {
            sender.send(()).unwrap();
        }
        res
    }

    fn respond_impl<R>(&mut self, response: Response<R>) -> Result<(), IoError>
    where
        R: Read,
    {
        let mut writer = self.extract_writer_impl();

        let do_not_send_body = self.method == Method::Head;

        Self::ignore_client_closing_errors(response.raw_print(
            writer.by_ref(),
            self.http_version.clone(),
            &self.headers,
            do_not_send_body,
            None,
        ))?;

        Self::ignore_client_closing_errors(writer.flush())
    }

    fn ignore_client_closing_errors(result: io::Result<()>) -> io::Result<()> {
        result.or_else(|err| match err.kind() {
            ErrorKind::BrokenPipe => Ok(()),
            ErrorKind::ConnectionAborted => Ok(()),
            ErrorKind::ConnectionRefused => Ok(()),
            ErrorKind::ConnectionReset => Ok(()),
            _ => Err(err),
        })
    }

    pub(crate) fn with_notify_sender(mut self, sender: Sender<()>) -> Self {
        self.notify_when_responded = Some(sender);
        self
    }
}

impl fmt::Debug for Request {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> Result<(), fmt::Error> {
        write!(
            formatter,
            "Request({} {} from {:?})",
            self.method, self.path, self.remote_addr
        )
    }
}

impl Drop for Request {
    fn drop(&mut self) {
        if self.response_writer.is_some() {
            let response = Response::empty(500);
            let _ = self.respond_impl(response); // ignoring any potential error
            if let Some(sender) = self.notify_when_responded.take() {
                sender.send(()).unwrap();
            }
        }
        // EqualReader drains unfinished data when dropped to support HTTP
        // keep-alive. The caller owns clearing its timeout after successful
        // consumption; doing so here can clear a newer request's timeout.
        drop(self.data_reader.take());
    }
}

/// Dummy trait that regroups the `Read` and `Write` traits.
///
/// Automatically implemented on all types that implement both `Read` and `Write`.
pub trait ReadWrite: Read + Write {}
impl<T> ReadWrite for T where T: Read + Write {}

#[cfg(test)]
mod tests {
    use super::Request;
    use super::{ClearTimeoutOnEof, FusedReader};
    use crate::connection::Connection;
    use crate::util::RefinedTcpStream;
    use crate::{Response, Server};
    use std::io::{ErrorKind, Read, Write};
    use std::net::{Shutdown, TcpStream};
    use std::sync::mpsc;
    use std::time::Duration;

    #[test]
    fn must_be_send() {
        #![allow(dead_code)]
        fn f<T: Send>(_: &T) {}
        fn bar(rq: &Request) {
            f(rq);
        }
    }

    fn assert_older_request_drop_keeps_newer_body_timeout(
        first_request: &[u8],
        expected_first_body: &[u8],
    ) {
        let server = Server::http("127.0.0.1:0").unwrap();
        let address = server.server_addr().to_ip().unwrap();
        let mut client = TcpStream::connect(address).unwrap();
        client.write_all(first_request).unwrap();
        client
            .write_all(b"POST /second HTTP/1.1\r\nHost: localhost\r\nContent-Length: 1025\r\n\r\n")
            .unwrap();

        let mut first = server
            .recv_timeout(Duration::from_secs(1))
            .unwrap()
            .expect("first request was not received");
        let mut completed_body = Vec::new();
        first.as_reader().read_to_end(&mut completed_body).unwrap();
        assert_eq!(completed_body, expected_first_body);
        let mut second = server
            .recv_timeout(Duration::from_secs(1))
            .unwrap()
            .expect("second request was not received");
        second
            .set_body_read_timeout(Some(Duration::from_millis(50)))
            .unwrap();
        drop(first);

        let (result_tx, result_rx) = mpsc::channel();
        std::thread::spawn(move || {
            let mut body = [0];
            let _ = result_tx.send(second.as_reader().read(&mut body));
        });
        let result = match result_rx.recv_timeout(Duration::from_secs(1)) {
            Ok(result) => result,
            Err(mpsc::RecvTimeoutError::Timeout) => {
                client.shutdown(Shutdown::Write).unwrap();
                result_rx
                    .recv_timeout(Duration::from_secs(1))
                    .expect("body read did not stop after client disconnect")
            }
            Err(mpsc::RecvTimeoutError::Disconnected) => panic!("body reader disconnected"),
        };
        assert!(matches!(
            result
                .expect_err("newer body read completed without a timeout")
                .kind(),
            ErrorKind::TimedOut | ErrorKind::WouldBlock
        ));
    }

    #[test]
    fn dropping_a_completed_request_keeps_the_newer_body_timeout() {
        assert_older_request_drop_keeps_newer_body_timeout(
            b"POST /first HTTP/1.1\r\nHost: localhost\r\nContent-Length: 1\r\n\r\nx",
            b"x",
        );
    }

    #[test]
    fn dropping_an_untimed_request_keeps_the_newer_body_timeout() {
        assert_older_request_drop_keeps_newer_body_timeout(
            b"GET /first HTTP/1.1\r\nHost: localhost\r\nContent-Length: 0\r\n\r\n",
            b"",
        );
    }

    #[test]
    fn failed_body_timeout_arm_still_aborts_after_an_explicit_clear() {
        let server = Server::http("127.0.0.1:0").unwrap();
        let address = server.server_addr().to_ip().unwrap();
        let mut client = TcpStream::connect(address).unwrap();
        client
            .write_all(b"POST /upload HTTP/1.1\r\nHost: localhost\r\nContent-Length: 1025\r\n\r\n")
            .unwrap();

        let mut request = server
            .recv_timeout(Duration::from_secs(1))
            .unwrap()
            .expect("upload request was not received");
        assert_eq!(
            request
                .set_body_read_timeout(Some(Duration::ZERO))
                .unwrap_err()
                .kind(),
            ErrorKind::InvalidInput
        );
        request.set_body_read_timeout(None).unwrap();
        request.abort_body();
        assert_eq!(
            request.as_reader().read(&mut [0]).unwrap_err().kind(),
            ErrorKind::ConnectionAborted
        );

        client
            .set_read_timeout(Some(Duration::from_secs(1)))
            .unwrap();
        request.respond(Response::empty(408)).unwrap();
        let mut response = [0; 12];
        client.read_exact(&mut response).unwrap();
        assert_eq!(&response[..8], b"HTTP/1.1");
    }

    #[test]
    fn completing_a_streaming_request_cannot_clear_the_next_body_timeout() {
        let server = Server::http("127.0.0.1:0").unwrap();
        let address = server.server_addr().to_ip().unwrap();
        let mut client = TcpStream::connect(address).unwrap();
        let first_body = vec![b'x'; 1025];
        client
            .write_all(b"POST /first HTTP/1.1\r\nHost: localhost\r\nContent-Length: 1025\r\n\r\n")
            .unwrap();
        client.write_all(&first_body).unwrap();
        client
            .write_all(b"POST /second HTTP/1.1\r\nHost: localhost\r\nContent-Length: 1025\r\n\r\n")
            .unwrap();

        let mut first = server
            .recv_timeout(Duration::from_secs(1))
            .unwrap()
            .expect("first request was not received");
        first
            .set_body_read_timeout(Some(Duration::from_secs(1)))
            .unwrap();

        let (eof_tx, eof_rx) = mpsc::channel();
        let (clear_tx, clear_rx) = mpsc::channel();
        let (cleared_tx, cleared_rx) = mpsc::channel();
        let (abort_tx, abort_rx) = mpsc::channel();
        let (aborted_tx, aborted_rx) = mpsc::channel();
        std::thread::spawn(move || {
            let mut body = Vec::new();
            first.as_reader().read_to_end(&mut body).unwrap();
            assert_eq!(body.len(), 1025);
            eof_tx.send(()).unwrap();
            clear_rx.recv().unwrap();
            first.set_body_read_timeout(None).unwrap();
            cleared_tx.send(()).unwrap();
            abort_rx.recv().unwrap();
            first.abort_body();
            aborted_tx.send(()).unwrap();
        });
        eof_rx
            .recv_timeout(Duration::from_secs(1))
            .expect("first streaming body did not complete");

        let mut second = server
            .recv_timeout(Duration::from_secs(1))
            .unwrap()
            .expect("second request was not received after first EOF");
        second
            .set_body_read_timeout(Some(Duration::from_millis(50)))
            .unwrap();
        clear_tx.send(()).unwrap();
        cleared_rx
            .recv_timeout(Duration::from_secs(1))
            .expect("first request did not clear its timeout");
        abort_tx.send(()).unwrap();
        aborted_rx
            .recv_timeout(Duration::from_secs(1))
            .expect("first request did not finish its stale abort");

        let (result_tx, result_rx) = mpsc::channel();
        std::thread::spawn(move || {
            let mut body = [0];
            let _ = result_tx.send(second.as_reader().read(&mut body));
        });
        let result = match result_rx.recv_timeout(Duration::from_secs(1)) {
            Ok(result) => result,
            Err(mpsc::RecvTimeoutError::Timeout) => {
                client.shutdown(Shutdown::Write).unwrap();
                result_rx
                    .recv_timeout(Duration::from_secs(1))
                    .expect("second body read did not stop after client disconnect")
            }
            Err(mpsc::RecvTimeoutError::Disconnected) => panic!("second body reader disconnected"),
        };
        assert!(matches!(
            result
                .expect_err("newer body read completed without a timeout")
                .kind(),
            ErrorKind::TimedOut | ErrorKind::WouldBlock
        ));
    }

    #[test]
    fn streaming_eof_clears_timeout_before_releasing_its_reader() {
        struct EofOnRead(mpsc::Sender<()>);

        impl Read for EofOnRead {
            fn read(&mut self, _buf: &mut [u8]) -> std::io::Result<usize> {
                Ok(0)
            }
        }

        impl Drop for EofOnRead {
            fn drop(&mut self) {
                self.0.send(()).unwrap();
            }
        }

        let listener = std::net::TcpListener::bind(("127.0.0.1", 0)).unwrap();
        let address = listener.local_addr().unwrap();
        let mut client = TcpStream::connect(address).unwrap();
        let (server, _) = listener.accept().unwrap();
        let (mut parser, _) = RefinedTcpStream::new(Connection::from(server));
        let lease = parser.read_timeout().lease();
        lease.arm(Duration::from_millis(50)).unwrap();

        let (released_tx, released_rx) = mpsc::channel();
        let mut body = FusedReader::new(ClearTimeoutOnEof::new(EofOnRead(released_tx), lease));
        let (result_tx, result_rx) = mpsc::channel();
        let (started_tx, started_rx) = mpsc::channel();
        std::thread::spawn(move || {
            released_rx.recv().unwrap();
            started_tx.send(()).unwrap();
            let mut byte = [0];
            let _ = result_tx.send(parser.read(&mut byte));
        });

        assert_eq!(body.read(&mut [0]).unwrap(), 0);
        started_rx
            .recv_timeout(Duration::from_secs(1))
            .expect("parser did not start after streaming EOF");
        std::thread::sleep(Duration::from_millis(125));
        client.write_all(b"x").unwrap();
        assert_eq!(
            result_rx
                .recv_timeout(Duration::from_secs(1))
                .expect("parser did not resume after streaming EOF")
                .unwrap(),
            1
        );
    }
}
