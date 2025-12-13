# Express Recap

Express app with OpenTelemetry tracing via SigNoz

---

## Table of Contents

- [Quick Start](#quick-start)
- [Access Points](#access-points)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
- [SigNoz Connection](#signoz-connection)
- [OpenTelemetry Setup](#opentelemetry-setup)
- [View Traces](#view-traces)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

```bash
# Install dependencies
npm install

# Start SigNoz (from docker folder)
docker-compose -f docker/docker-compose.yaml up -d

# Start application
npm run dev

# Test endpoint
curl -X POST http://localhost:3000/user/create \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com"}'
```

---

## Access Points

| Service | URL |
|---------|-----|
| **API** | http://localhost:3000 |
| **SigNoz UI** | http://localhost:8080 |
| **OTLP HTTP** | http://localhost:4318/v1/traces |
| **OTLP gRPC** | http://localhost:4317 |

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | API information |
| `GET` | `/health` | Health check |
| `POST` | `/user/create` | Create user (with validation and OpenTelemetry tracing) |

---

## Configuration

Create a `.env` file:

```bash
# OpenTelemetry
OTEL_SERVICE_NAME=express-recap
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318/v1/traces
```

---

## SigNoz Connection

### Verify SigNoz is Running

```bash
# Check SigNoz containers
docker ps | grep signoz

# Check OTLP endpoint (405 is normal)
curl http://localhost:4318/v1/traces

# Check SigNoz health
curl http://localhost:8080/api/v1/health
```

### Console Logs

When running correctly, you should see:
```
✅ OpenTelemetry SDK initialized
📡 Sending traces to: http://localhost:4318/v1/traces
📊 OpenTelemetry: Started span for POST /user/create [request-id]
✅ OpenTelemetry: Completed span for POST /user/create [request-id] - Status: 201 (45ms)
```

---

## OpenTelemetry Setup

### Apply Middleware

```javascript
import { openTelemetryLogger } from "../middleware/openTelemetryLogger.js";

router.post("/route", requestId, openTelemetryLogger(), handler);
```

### What Gets Captured

- **Request**: method, path, headers, body, IP, query params
- **Response**: status code, headers, body, response time
- **Timing**: start time, end time, duration

---

## View Traces

1. Open http://localhost:8080
2. Navigate to "Traces"
3. Filter by service: `express-recap`

---

## Troubleshooting

### SigNoz Not Running

```bash
docker-compose -f docker/docker-compose.yaml ps
docker-compose -f docker/docker-compose.yaml logs signoz
```

### Traces Not Appearing

1. Check SigNoz logs:
   ```bash
   docker logs signoz-otel-collector
   ```

2. Check OTLP endpoint:
   ```bash
   curl -v http://localhost:4318/v1/traces
   ```

3. Check app logs for OpenTelemetry initialization messages

### Port Conflicts

```bash
sudo lsof -i :4318
sudo lsof -i :8080
```
