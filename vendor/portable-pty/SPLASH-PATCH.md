# portable-pty 0.9.0 patch

MIT source from crates.io 0.9.0. Adds Windows-only CommandBuilder::set_suspended
and passes CREATE_SUSPENDED to ConPTY CreateProcessW. Splash assigns the shell
to a kill-on-close Job Object before resuming its threads. Without this boundary,
a fast shell can spawn descendants before job assignment. All other behavior
is upstream. Remove the patch when upstream supports suspended creation/hooks.
