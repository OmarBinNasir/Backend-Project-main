import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

const failures = new Counter('failed_requests');
const successRate = new Rate('successful_requests');
const requestDuration = new Trend('request_duration_ms', true);
const scenario = (__ENV.SCENARIO || 'load').toLowerCase();
const baseUrl = (__ENV.BASE_URL || 'http://localhost:8080').replace(/\/$/, '');
const path = __ENV.BENCHMARK_PATH || '/health';
const token = __ENV.BENCHMARK_TOKEN;
const params = {
  headers: token ? { Authorization: `Bearer ${token}` } : {},
  tags: { endpoint: path, scenario },
};

const profiles = {
  smoke: {
    vus: 1,
    duration: '30s',
  },
  load: {
    stages: [
      { duration: '30s', target: 10 },
      { duration: '1m', target: 25 },
      { duration: '2m', target: 50 },
      { duration: '30s', target: 0 },
    ],
  },
  stress: {
    stages: [
      { duration: '30s', target: 25 },
      { duration: '1m', target: 50 },
      { duration: '1m', target: 100 },
      { duration: '1m', target: 150 },
      { duration: '30s', target: 0 },
    ],
  },
  spike: {
    stages: [
      { duration: '10s', target: 10 },
      { duration: '10s', target: 150 },
      { duration: '30s', target: 150 },
      { duration: '10s', target: 10 },
      { duration: '20s', target: 0 },
    ],
  },
};

if (!profiles[scenario]) {
  throw new Error(`Unknown SCENARIO "${scenario}". Use smoke, load, stress, or spike.`);
}

export const options = {
  ...profiles[scenario],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
};

export default function () {
  const response = http.get(`${baseUrl}${path}`, params);
  const ok = check(response, {
    'status is 2xx': (r) => r.status >= 200 && r.status < 300,
  });
  successRate.add(ok);
  requestDuration.add(response.timings.duration);
  if (!ok) failures.add(1);
  sleep(0.1);
}

export function handleSummary(data) {
  const metrics = data.metrics || {};
  const get = (name, key) => metrics[name]?.values?.[key] ?? null;
  const report = {
    scenario,
    baseUrl,
    path,
    generatedAt: new Date().toISOString(),
    requestsPerSecond: get('http_reqs', 'rate'),
    totalRequests: get('http_reqs', 'count'),
    failedRequests: get('failed_requests', 'count') ?? 0,
    failureRate: get('http_req_failed', 'rate'),
    p50Ms: get('http_req_duration', 'med'),
    p95Ms: get('http_req_duration', 'p(95)'),
    p99Ms: get('http_req_duration', 'p(99)'),
    avgMs: get('http_req_duration', 'avg'),
  };
  return {
    stdout: `${JSON.stringify(report, null, 2)}\n`,
    'benchmark-results.json': `${JSON.stringify(report, null, 2)}\n`,
  };
}
