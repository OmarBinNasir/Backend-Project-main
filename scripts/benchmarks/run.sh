#!/usr/bin/env sh
set -eu
if ! command -v k6 >/dev/null 2>&1; then
  echo 'k6 is required. Install it from https://grafana.com/docs/k6/latest/set-up/install-k6/' >&2
  exit 1
fi
SCENARIO="${SCENARIO:-load}"
BASE_URL="${BASE_URL:-http://localhost:8080}"
BENCHMARK_PATH="${BENCHMARK_PATH:-/health}"
export SCENARIO BASE_URL BENCHMARK_PATH
k6 run scripts/benchmarks/read-load.js
