#!/bin/bash

set -e

build() {
  rm -rf dist
  npm run build:fe && npm run build:blog
}

"$@"
