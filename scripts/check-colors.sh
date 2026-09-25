#!/usr/bin/env bash
# Every colour lives in app.css :root as a token; components use var(--…).
# Checks hex, the colour functions and named colours in colour properties,
# in the UI source (.svelte, .ts, .js, app.css) and the SVG assets.
set -euo pipefail
cd "$(dirname "$0")/../app"

# Colour literals and functions. `lab(` also catches `oklab(`.
pattern='#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|hwb\(|oklch\(|lch\(|lab\(|color-mix\('
# Named colours as a property value (CSS, inline styles, SVG attributes).
names='white|black|red|green|blue|yellow|orange|purple|pink|gray|grey|silver|gold|navy|teal|cyan|magenta|lime|maroon|olive|aqua|fuchsia|brown|indigo|violet'
named="(color|background|background-color|border|border-color|outline|outline-color|fill|stroke|box-shadow|caret-color|text-decoration-color)[[:space:]]*[:=]([^;{}]*[[:space:]\"'(,])?($names)\\b"

# Allowed, on purpose:
# - bindings.ts: generated.
# - playground/tweaks.svelte.ts: rewrites the :root accent tokens at runtime,
#   derived from other tokens with color-mix().
allow='^src/bindings\.ts:|^src/components/playground/tweaks\.svelte\.ts:[0-9]+:.*color-mix\('

src=$( { grep -rnE "$pattern" --include='*.svelte' --include='*.ts' --include='*.js' src || true; } | grep -vE "$allow" || true)
names_found=$( { grep -rnE "$named" --include='*.svelte' --include='*.css' src || true; } | grep -vE "$allow" || true)
# SVG assets draw with currentColor. public/icon.svg (the app icon) is exempt.
svg=$(grep -rnEi "$pattern|(fill|stroke)=\"($names)\"" --include='*.svg' src/assets || true)
# app.css: only inside the :root block.
css=$(awk '/^:root/{f=1} f&&/^}/{f=0; next} !f' src/app.css | grep -nE "$pattern" || true)

if [ -n "$src$names_found$svg$css" ]; then
  echo "colour literals outside the :root tokens:" >&2
  [ -n "$src" ] && echo "$src" >&2
  [ -n "$names_found" ] && echo "$names_found" >&2
  [ -n "$svg" ] && echo "$svg" >&2
  [ -n "$css" ] && echo "app.css: $css" >&2
  exit 1
fi
