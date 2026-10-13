# VPlay scaling and benchmark setup

This adds a reverse-proxy load balancer, two stateless copies of the API, a MongoDB replica set, and k6 benchmark profiles.

## Architecture

```text
Browser / k6
    |
    v
NGINX proxy :8080 (round-robin)
    |-------------------|
    v                   v
API instance 1       API instance 2
    |                   |
    +---------+---------+
              v
    MongoDB replica set rs0
    mongo1 (preferred primary) + mongo2 (secondary) + mongo3 (arbiter)
```

**Database topology clarification:** MongoDB replica-set members have separate physical data files and automatically replicate the same logical database. This is the correct way to keep synchronized copies while preserving a single consistent write authority. They are not two independently writable, unrelated databases. Writing independently to two standalone databases would require conflict resolution and a separate replication design; it is not safe to pretend those writes are automatically synchronized.

The compose topology uses two data-bearing MongoDB members and an arbiter to make up three voting members. This is a learning/development topology, not a production high-availability recommendation: a two-data-bearing-member replica set has limited fault tolerance for data-bearing node failures. For production, prefer three data-bearing members across separate hosts/availability zones, authentication/TLS, backups, monitoring, resource limits, and secrets management.

## Start locally

Requirements: Docker Compose v2, and Node.js only if running the API outside Docker.

1. Copy `.env.sample` to `.env`.
2. Replace both token secrets with long random values. Set Cloudinary credentials if you intend to upload videos.
3. Start the stack:

   ```sh
   docker compose up --build -d
   docker compose ps
   ```

4. Check the proxy and API health:

   ```sh
   curl -i http://localhost:8080/health
   curl -s http://localhost:8080/
   ```

5. Verify requests are being distributed across instances:

   ```sh
   for i in $(seq 1 12); do curl -s http://localhost:8080/health; echo; done
   ```

   The JSON `instance` field should show `api1` and `api2` across repeated requests. Load balancing is not a guarantee that every short series alternates perfectly.

## k6 benchmark profiles

Install k6 on the host, then run from the project root:

```sh
npm run bench:smoke
npm run bench:load
npm run bench:stress
npm run bench:spike
```

Defaults target `http://localhost:8080/health`. `/health` measures the proxy + Node HTTP tier and intentionally does not query MongoDB. For a real, database-backed read test, set `BENCHMARK_PATH` to a valid read route and supply a JWT if that route requires authentication. For example:

```sh
BASE_URL=http://localhost:8080 \
BENCHMARK_PATH='/api/v1/videos?page=1&limit=10' \
BENCHMARK_TOKEN='YOUR_TEST_USER_ACCESS_TOKEN' \
SCENARIO=load sh scripts/benchmarks/run.sh
```

Only use a test account and non-production data. Keep test duration and concurrency within the capacity of your machine and any external services.

Each run prints a JSON summary and writes `benchmark-results.json` in the project root (overwritten by each run). It includes request rate, total/failed requests, failure rate, median, p95, p99, and average latency. k6 thresholds are currently set to less than 1% failed requests and p95 under 500 ms; adjust them to your application's SLO.

## Compare one vs. two API instances

To establish a useful baseline, do not compare different workloads:

- Baseline: temporarily stop `api2` (`docker compose stop api2`) and run the same profile.
- Scaled: start it (`docker compose start api2`) and repeat the same profile.
- Allow warm-up time and repeat runs; compare the median result across runs, not a single lucky run.
- Watch Docker CPU/memory and MongoDB/Redis (if added) separately. A high RPS on `/health` does not represent a database-backed video feed's capacity.

Restore both API instances after the baseline: `docker compose start api1 api2`.

## Configuration notes

- NGINX is exposed on port `8080`; backend instances are internal to the Docker network.
- The frontend API base URL can be overridden with `VITE_API_BASE_URL`; default is `http://localhost:8080`.
- The API's `/health` endpoint returns the instance ID to help verify distribution.
- Mongoose connection pool size can be adjusted with `MONGO_MAX_POOL_SIZE` and `MONGO_MIN_POOL_SIZE`.
- Uploaded video binaries are stored by Cloudinary; MongoDB replication copies the metadata documents, not the media stored externally.
- The current app has no Redis cache configured in this change. This deployment isolates the load-balancing and database-replication effects first so the benchmark can measure them independently.
