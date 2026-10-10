use std::io::Result as IoResult;
use std::io::{ErrorKind, Read, Write};
use std::net::{Shutdown, SocketAddr};
use std::sync::{Arc, Mutex};
use std::time::Duration;

use crate::connection::Connection;
#[cfg(any(feature = "ssl-openssl", feature = "ssl-rustls"))]
use crate::ssl::SslStream;

pub(crate) enum Stream {
    Http(Connection),
    #[cfg(any(feature = "ssl-openssl", feature = "ssl-rustls"))]
    Https(SslStream),
}

impl Clone for Stream {
    fn clone(&self) -> Self {
        match self {
            Stream::Http(tcp_stream) => Stream::Http(tcp_stream.try_clone().unwrap()),
            #[cfg(any(feature = "ssl-openssl", feature = "ssl-rustls"))]
            Stream::Https(ssl_stream) => Stream::Https(ssl_stream.clone()),
        }
    }
}

impl From<Connection> for Stream {
    fn from(tcp_stream: Connection) -> Self {
        Stream::Http(tcp_stream)
    }
}

impl Stream {
    fn secure(&self) -> bool {
        match self {
            Stream::Http(_) => false,
            #[cfg(any(feature = "ssl-openssl", feature = "ssl-rustls"))]
            Stream::Https(_) => true,
        }
    }

    fn peer_addr(&mut self) -> IoResult<Option<SocketAddr>> {
        match self {
            Stream::Http(tcp_stream) => tcp_stream.peer_addr(),
            #[cfg(any(feature = "ssl-openssl", feature = "ssl-rustls"))]
            Stream::Https(ssl_stream) => ssl_stream.peer_addr(),
        }
    }

    fn shutdown(&mut self, how: Shutdown) -> IoResult<()> {
        match self {
            Stream::Http(tcp_stream) => tcp_stream.shutdown(how),
            #[cfg(any(feature = "ssl-openssl", feature = "ssl-rustls"))]
            Stream::Https(ssl_stream) => ssl_stream.shutdown(how),
        }
    }

    fn set_read_timeout(&self, timeout: Option<Duration>) -> IoResult<()> {
        match self {
            Stream::Http(connection) => connection.set_read_timeout(timeout),
            #[cfg(any(feature = "ssl-openssl", feature = "ssl-rustls"))]
            Stream::Https(_) if timeout.is_some() => Err(std::io::Error::new(
                std::io::ErrorKind::Unsupported,
                "read timeouts are unavailable for TLS streams",
            )),
            #[cfg(any(feature = "ssl-openssl", feature = "ssl-rustls"))]
            Stream::Https(_) => Ok(()),
        }
    }
}

impl Read for Stream {
    fn read(&mut self, buf: &mut [u8]) -> IoResult<usize> {
        match self {
            Stream::Http(tcp_stream) => tcp_stream.read(buf),
            #[cfg(any(feature = "ssl-openssl", feature = "ssl-rustls"))]
            Stream::Https(ssl_stream) => ssl_stream.read(buf),
        }
    }
}

impl Write for Stream {
    fn write(&mut self, buf: &[u8]) -> IoResult<usize> {
        match self {
            Stream::Http(tcp_stream) => tcp_stream.write(buf),
            #[cfg(any(feature = "ssl-openssl", feature = "ssl-rustls"))]
            Stream::Https(ssl_stream) => ssl_stream.write(buf),
        }
    }

    fn flush(&mut self) -> IoResult<()> {
        match self {
            Stream::Http(tcp_stream) => tcp_stream.flush(),
            #[cfg(any(feature = "ssl-openssl", feature = "ssl-rustls"))]
            Stream::Https(ssl_stream) => ssl_stream.flush(),
        }
    }
}

pub struct RefinedTcpStream {
    stream: Stream,
    read_control: Arc<Mutex<ReadControl>>,
    close_read: bool,
    close_write: bool,
}

#[derive(Clone, Copy, Default)]
struct ReadControl {
    timeout: Option<Duration>,
    aborted: bool,
}

#[derive(Clone)]
pub(crate) struct ReadTimeout {
    stream: Stream,
    read_control: Arc<Mutex<ReadControl>>,
}

impl ReadTimeout {
    pub(crate) fn set(&self, timeout: Option<Duration>) -> IoResult<()> {
        self.stream.set_read_timeout(timeout)?;
        let mut control = self
            .read_control
            .lock()
            .map_err(|_| std::io::Error::other("request read timeout state is poisoned"))?;
        *control = ReadControl {
            timeout,
            aborted: false,
        };
        Ok(())
    }

    pub(crate) fn abort(&mut self) -> IoResult<()> {
        let mut control = self
            .read_control
            .lock()
            .map_err(|_| std::io::Error::other("request read timeout state is poisoned"))?;
        control.aborted = true;
        drop(control);
        self.stream.shutdown(Shutdown::Read)
    }
}

impl RefinedTcpStream {
    pub(crate) fn new<S>(stream: S) -> (RefinedTcpStream, RefinedTcpStream)
    where
        S: Into<Stream>,
    {
        let stream: Stream = stream.into();

        let (read, write) = (stream.clone(), stream);
        let read_control = Arc::new(Mutex::new(ReadControl::default()));

        let read = RefinedTcpStream {
            stream: read,
            read_control: read_control.clone(),
            close_read: true,
            close_write: false,
        };

        let write = RefinedTcpStream {
            stream: write,
            read_control,
            close_read: false,
            close_write: true,
        };

        (read, write)
    }

    /// Returns true if this struct wraps around a secure connection.
    #[inline]
    pub(crate) fn secure(&self) -> bool {
        self.stream.secure()
    }

    pub(crate) fn peer_addr(&mut self) -> IoResult<Option<SocketAddr>> {
        self.stream.peer_addr()
    }

    pub(crate) fn read_timeout(&self) -> ReadTimeout {
        ReadTimeout {
            stream: self.stream.clone(),
            read_control: self.read_control.clone(),
        }
    }
}

impl Drop for RefinedTcpStream {
    fn drop(&mut self) {
        if self.close_read {
            self.stream.shutdown(Shutdown::Read).ok();
        }

        if self.close_write {
            self.stream.shutdown(Shutdown::Write).ok();
        }
    }
}

impl Read for RefinedTcpStream {
    fn read(&mut self, buf: &mut [u8]) -> IoResult<usize> {
        let control = *self
            .read_control
            .lock()
            .map_err(|_| std::io::Error::other("request read timeout state is poisoned"))?;
        if control.aborted {
            let _ = self.stream.shutdown(Shutdown::Read);
            return Err(std::io::Error::new(
                ErrorKind::ConnectionAborted,
                "request body was aborted",
            ));
        }
        self.stream.set_read_timeout(control.timeout)?;
        self.stream.read(buf)
    }
}

impl Write for RefinedTcpStream {
    fn write(&mut self, buf: &[u8]) -> IoResult<usize> {
        self.stream.write(buf)
    }

    fn flush(&mut self) -> IoResult<()> {
        self.stream.flush()
    }
}

#[cfg(test)]
mod tests {
    use super::RefinedTcpStream;
    use crate::connection::Connection;
    use std::io::{ErrorKind, Read, Write};
    use std::net::{TcpListener, TcpStream};
    use std::sync::mpsc;
    use std::time::Duration;

    #[test]
    fn timeout_controller_applies_to_the_reader_socket() {
        let listener = TcpListener::bind(("127.0.0.1", 0)).unwrap();
        let address = listener.local_addr().unwrap();
        let client = TcpStream::connect(address).unwrap();
        let (server, _) = listener.accept().unwrap();
        let (mut reader, _) = RefinedTcpStream::new(Connection::from(server));
        let controller = reader.read_timeout();
        controller.set(Some(Duration::from_millis(50))).unwrap();

        let (result_tx, result_rx) = mpsc::channel();
        std::thread::spawn(move || {
            let mut byte = [0];
            let _ = result_tx.send(reader.read(&mut byte));
        });

        let result = match result_rx.recv_timeout(Duration::from_secs(1)) {
            Ok(result) => result,
            Err(mpsc::RecvTimeoutError::Timeout) => {
                // Release a broken implementation's blocked read so this
                // regression fails rather than hanging the test.
                drop(client);
                result_rx
                    .recv_timeout(Duration::from_secs(1))
                    .expect("reader did not stop after peer disconnect")
            }
            Err(mpsc::RecvTimeoutError::Disconnected) => panic!("reader thread disconnected"),
        };
        assert!(matches!(
            result.unwrap_err().kind(),
            ErrorKind::TimedOut | ErrorKind::WouldBlock
        ));
    }

    #[test]
    fn abort_controller_keeps_the_write_half_available() {
        let listener = TcpListener::bind(("127.0.0.1", 0)).unwrap();
        let address = listener.local_addr().unwrap();
        let mut client = TcpStream::connect(address).unwrap();
        let (server, _) = listener.accept().unwrap();
        let (mut reader, mut writer) = RefinedTcpStream::new(Connection::from(server));
        let mut controller = reader.read_timeout();

        controller.abort().unwrap();
        let mut byte = [0];
        assert_eq!(
            reader.read(&mut byte).unwrap_err().kind(),
            ErrorKind::ConnectionAborted
        );

        client
            .set_read_timeout(Some(Duration::from_secs(1)))
            .unwrap();
        writer.write_all(b"408").unwrap();
        let mut response = [0; 3];
        client.read_exact(&mut response).unwrap();
        assert_eq!(&response, b"408");
    }
}
