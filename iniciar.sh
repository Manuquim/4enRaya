#!/bin/sh
cd "$(dirname "$0")" || exit 1
if ! command -v node >/dev/null 2>&1; then
  printf '%s\n' 'Necesitas Node.js 18 o posterior para iniciar el juego.' >&2
  exit 1
fi
exec node run
