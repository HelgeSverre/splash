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

`Cargo.toml` drops the dev-dependencies and allows the `unused` lints that newer
compilers raise in the upstream source. All other behavior is upstream. Remove the patch when an upstream release fixes
the pool.
