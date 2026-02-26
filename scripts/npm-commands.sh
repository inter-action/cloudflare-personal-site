#!/bin/bash

set -e

build:api() {
  mkdir -p dist/_worker.js
  npx esbuild api/index.ts --bundle --minify --format=esm --outfile=dist/_worker.js/index.js \
    --external:*.png --external:*.svg --external:*.jpg --external:*.jpeg \
    --external:*.gif --external:*.woff --external:*.woff2 --external:*.ttf --external:*.eot
}

"$@"
