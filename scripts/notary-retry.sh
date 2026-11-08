#!/usr/bin/env bash
# A notarization acceptance can precede a transient ticket-service failure.
# Retry only ticket retrieval; signing, submission and validation stay separate.

staple_notarized() (
  set -euo pipefail
  local artifact="$1" log attempt status delay=5
  log=$(mktemp)
  trap 'rm -f "$log"' EXIT
  for attempt in 1 2 3 4 5; do
    if xcrun stapler staple "$artifact" > "$log" 2>&1; then
      cat "$log"
      return 0
    else
      status=$?
    fi
    cat "$log" >&2
    if [[ "$attempt" == 5 ]] || ! grep -Eqi 'NSURLErrorDomain|network connection|timed out|could not connect' "$log"; then
      return "$status"
    fi
    echo "Apple ticket service unavailable; retrying stapling in ${delay}s (${attempt}/5)." >&2
    sleep "$delay"
    delay=$((delay * 2))
  done
)
