#!/usr/bin/env bash
# Every colour lives in app.css :root as a token; components use var(--…).
set -euo pipefail
cd "$(dirname "$0")/../app/src"
pattern='#[0-9a-fA-F]{3,8}\b|rgba?\('
found=$(grep -rnE "$pattern" --include='*.svelte' --include='*.ts' --include='*.js' . | grep -v 'bindings.ts' || true)
# app.css: only inside the :root block.
css=$(awk '/^:root/{f=1} f&&/^}/{f=0; next} !f' app.css | grep -nE "$pattern" || true)
if [ -n "$found$css" ]; then
  echo "colour literals outside the :root tokens:" >&2
  [ -n "$found" ] && echo "$found" >&2
  [ -n "$css" ] && echo "app.css: $css" >&2
  exit 1
fi
