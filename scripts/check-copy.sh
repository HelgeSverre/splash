#!/usr/bin/env bash
# No em dashes in user-facing copy (house style: short, plain sentences).
# Comments may use them; everything else in the UI source may not.
set -euo pipefail
cd "$(dirname "$0")/../app/src"
found=$(grep -rn '—' --include='*.svelte' --include='*.ts' --include='*.js' . | grep -v '^./bindings.ts:' |
  perl -ne 'my ($loc, $code) = /^([^:]+:\d+:)(.*)$/ or next;
    $code =~ s{<!--.*?-->}{}g; $code =~ s{/\*.*?\*/}{}g; $code =~ s{(^|\s)//.*$}{}; $code =~ s{^\s*\*.*$}{};
    print "$loc$code\n" if $code =~ /—/;' || true)
if [ -n "$found" ]; then
  echo "em dashes in UI copy (rewrite as two short sentences, a comma or a colon):" >&2
  echo "$found" >&2
  exit 1
fi
