#!/usr/bin/env bash
# Keep the keyboard focus ring alive: `all: unset` resets `outline` and, with a
# class selector, outranks the global :focus-visible rule. Chrome-less buttons
# use the zero-specificity `.plain` class (app.css) instead.
set -euo pipefail
cd "$(dirname "$0")/../app/src"
found=$(grep -rnE 'all:[[:space:]]*unset' --include='*.svelte' --include='*.css' . | grep -v ':where(.plain)' || true)
if [ -n "$found" ]; then
  echo "all: unset outside :where(.plain) (use class=\"plain\" or .bare-input):" >&2
  echo "$found" >&2
  exit 1
fi

# Keyboard focus gets the same feedback as the mouse: a :hover style also
# covers :focus-visible (or :focus-within, or :focus in a menu). Mark a rule
# that is hover-only on purpose with a `/* hover-only */` comment.
hover=$(grep -rnE ':hover' --include='*.svelte' --include='*.css' . | grep -vE ':focus|hover-only' || true)
if [ -n "$hover" ]; then
  echo ":hover without :focus-visible (use :is(:hover, :focus-visible), or mark it /* hover-only */):" >&2
  echo "$hover" >&2
  exit 1
fi
