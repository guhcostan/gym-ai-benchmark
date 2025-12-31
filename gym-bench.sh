#!/bin/bash
# Gym AI Benchmark CLI wrapper

cd "$(dirname "$0")"
node packages/cli/dist/index.js "$@"

