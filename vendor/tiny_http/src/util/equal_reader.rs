use std::io::Read;
use std::io::Result as IoResult;
use std::sync::mpsc::channel;
use std::sync::mpsc::{Receiver, Sender};

const DRAIN_BUFFER_SIZE: usize = 8 * 1024;

/// A `Reader` that reads exactly the number of bytes from a sub-reader.
///
/// If the limit is reached, it returns EOF. If the limit is not reached
/// when the destructor is called, the remaining bytes will be read and
/// thrown away.
pub struct EqualReader<R>
where
    R: Read,
{
    reader: R,
    size: usize,
    last_read_signal: Sender<IoResult<()>>,
}

impl<R> EqualReader<R>
where
    R: Read,
{
    pub fn new(reader: R, size: usize) -> (EqualReader<R>, Receiver<IoResult<()>>) {
        let (tx, rx) = channel();

        let r = EqualReader {
            reader,
            size,
            last_read_signal: tx,
        };

        (r, rx)
    }
}

impl<R> Read for EqualReader<R>
where
    R: Read,
{
    fn read(&mut self, buf: &mut [u8]) -> IoResult<usize> {
        if self.size == 0 {
            return Ok(0);
        }

        let buf = if buf.len() < self.size {
            buf
        } else {
            &mut buf[..self.size]
        };

        match self.reader.read(buf) {
            Ok(len) => {
                self.size -= len;
                Ok(len)
            }
            err @ Err(_) => err,
        }
    }
}

impl<R> Drop for EqualReader<R>
where
    R: Read,
{
    fn drop(&mut self) {
        let mut buffer = [0; DRAIN_BUFFER_SIZE];

        while self.size > 0 {
            let to_read = self.size.min(buffer.len());

            match self.reader.read(&mut buffer[..to_read]) {
                Err(e) => {
                    self.last_read_signal.send(Err(e)).ok();
                    break;
                }
                Ok(0) => {
                    self.last_read_signal.send(Ok(())).ok();
                    break;
                }
                Ok(other) => {
                    self.size -= other;
                }
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::{EqualReader, DRAIN_BUFFER_SIZE};
    use std::cell::Cell;
    use std::io::Read;
    use std::rc::Rc;

    #[test]
    fn test_limit() {
        use std::io::Cursor;

        let mut org_reader = Cursor::new("hello world".to_string().into_bytes());

        {
            let (mut equal_reader, _) = EqualReader::new(org_reader.by_ref(), 5);

            let mut string = String::new();
            equal_reader.read_to_string(&mut string).unwrap();
            assert_eq!(string, "hello");
        }

        let mut string = String::new();
        org_reader.read_to_string(&mut string).unwrap();
        assert_eq!(string, " world");
    }

    #[test]
    fn test_not_enough() {
        use std::io::Cursor;

        let mut org_reader = Cursor::new("hello world".to_string().into_bytes());

        {
            let (mut equal_reader, _) = EqualReader::new(org_reader.by_ref(), 5);

            let mut vec = [0];
            equal_reader.read_exact(&mut vec).unwrap();
            assert_eq!(vec[0], b'h');
        }

        let mut string = String::new();
        org_reader.read_to_string(&mut string).unwrap();
        assert_eq!(string, " world");
    }

    #[test]
    fn drop_drains_with_a_bounded_buffer() {
        struct RecordingReader {
            remaining: usize,
            largest_buffer: Rc<Cell<usize>>,
        }

        impl Read for RecordingReader {
            fn read(&mut self, buffer: &mut [u8]) -> std::io::Result<usize> {
                self.largest_buffer
                    .set(self.largest_buffer.get().max(buffer.len()));
                let read = self.remaining.min(buffer.len());
                self.remaining -= read;
                Ok(read)
            }
        }

        let largest_buffer = Rc::new(Cell::new(0));
        let reader = RecordingReader {
            remaining: DRAIN_BUFFER_SIZE * 4,
            largest_buffer: largest_buffer.clone(),
        };
        let (reader, _) = EqualReader::new(reader, DRAIN_BUFFER_SIZE * 4);
        drop(reader);

        assert_eq!(largest_buffer.get(), DRAIN_BUFFER_SIZE);
    }
}
