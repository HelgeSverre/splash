## Reliability fixes

- Prevent acknowledged messages from being silently dropped when agent metadata and concurrent sends overlap.
- Preserve earlier tool entries when an agent reuses tool IDs across turns or resumes saved history.
- Clear permission-wait state promptly when a turn is cancelled.
- Make session creation, project removal, startup cancellation, and cold-session actions respect the same lifecycle rules.
- Prevent stale history searches from stranding refreshed results, and keep sign-in required when an older connection check finishes.
- Preserve quoted launch arguments, Windows paths, and the original agent profile text.

The cleanup also centralizes terminal cleanup and client state ownership, with regression coverage for retries and concurrency. See the state-machine reference in the repository for evidence and validation limits.

## Packaging

- Retry transient Apple ticket-service failures without repeating signing or notarization submission. Signature, stapled-ticket and Gatekeeper validation remain mandatory.
- This release includes the reliability fixes prepared for v0.2.2, which remained unpublished after Apple ticket-service failures.
