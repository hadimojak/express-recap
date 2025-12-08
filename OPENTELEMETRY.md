# OpenTelemetry Setup

## Start SigNoz

```bash
docker-compose -f docker/docker-compose.yaml up -d
```

Access UI: http://localhost:8080

## Configuration

Traces are sent to: `http://localhost:4318/v1/traces`

Customize in `.env`:
```bash
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318/v1/traces
OTEL_SERVICE_NAME=express-recap
```

## Apply Middleware

```javascript
import { openTelemetryLogger } from "../middleware/openTelemetryLogger.js";

router.post("/route", requestId, openTelemetryLogger(), handler);
```

## What Gets Captured

- **Request**: method, path, headers, body, IP, query params
- **Response**: status code, headers, body, response time
- **Timing**: start time, end time, duration

## Troubleshooting

**Traces not appearing:**
1. Check SigNoz: `docker ps | grep signoz`
2. Check endpoint: `curl http://localhost:4318/v1/traces`
3. Check app logs for OpenTelemetry initialization messages
