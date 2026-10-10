# tiny_http 0.12.0 patch

MIT/Apache-2.0 source from crates.io 0.12.0 (`src/` and licenses only; no
tests, examples or benches). `TaskPool::spawn` counted a worker as idle until
that worker took the lock again after being notified. When connections arrived
in a burst (a browser opening several keep-alive connections at page load), two
of them could be queued for one idle worker. The second one then waited, unread,
until some other connection closed. Requests stalled for seconds or indefinitely.
The patch counts queued tasks against the idle workers and starts a thread for
the rest (`src/util/task_pool.rs`). The test `a_burst_of_long_tasks_all_start`
covers it:

    cargo test --manifest-path vendor/tiny_http/Cargo.toml --lib task_pool

Splash also adds request-scoped incoming-body controls. `Request` now exposes
`set_body_read_timeout` and `abort_body`. The former applies an inactivity
timeout only while the host consumes a streaming request body; the latter
closes the read side before an unfinished `EqualReader` is dropped. This avoids
its upstream keep-alive drain blocking the host after an incomplete upload. The
timeout is cleared once the body is consumed, so idle keep-alive connections
and long-poll responses are not subject to it. Enabling the timeout on a TLS
stream returns `Unsupported` because this vendored transport cannot safely
apply the socket timeout there; clearing it is a no-op. The timeout state is applied by the active reader on
each read, while an aborted body interrupts only that read half and preserves
the response writer. `EqualReader` drains in fixed-size chunks, so an aborted
request with an arbitrary declared Content-Length cannot allocate a buffer
proportional to the remaining body.

`Cargo.toml` drops the dev-dependencies and allows the `unused` lints that newer
compilers raise in the upstream source. All other behavior is upstream. Remove the patch when an upstream release fixes
the pool.
