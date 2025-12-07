# OpenTelemetry Setup

This project uses OpenTelemetry for distributed tracing and route monitoring. The OpenTelemetry middleware captures the same context as the Elasticsearch logger for consistent monitoring.

## Features

- **Distributed Tracing**: Track requests across services
- **Route Monitoring**: Monitor all API routes with detailed context
- **Jaeger UI**: Visualize traces in Jaeger UI
- **Same Context**: Captures the same data structure as Elasticsearch logger

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Jaeger (for visualization)

Jaeger is already configured in `docker-compose.yml`. Start it:

```bash
docker-compose up -d jaeger
```

Or start all services:

```bash
docker-compose up -d
```

### 3. Access Jaeger UI

Open your browser and go to:
- **Jaeger UI**: http://localhost:16686

## Configuration

### Environment Variables

You can configure OpenTelemetry using environment variables:

```bash
# Service name (default: express-recap)
OTEL_SERVICE_NAME=express-recap

# Service version (default: 1.0.0)
OTEL_SERVICE_VERSION=1.0.0

# OTLP Endpoint (optional, defaults to Jaeger)
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318/v1/traces

# OTLP Headers (optional, JSON format)
OTEL_EXPORTER_OTLP_HEADERS={"Authorization": "Bearer token"}

# Jaeger Endpoint (default: http://localhost:14268/api/traces)
JAEGER_ENDPOINT=http://localhost:14268/api/traces
```

## Usage

### Apply Middleware to Routes

The OpenTelemetry middleware is already applied to the `/user/create` route. To add it to other routes:

```javascript
import { openTelemetryLogger } from "../middleware/openTelemetryLogger.js";

router.post("/your-route", requestId, openTelemetryLogger(), yourHandler);
```

### What Gets Captured

The OpenTelemetry middleware captures:

- **Request Information**:
  - HTTP method, URL, path, route
  - Headers, query params, request body
  - IP addresses, user agent
  - Request ID

- **Response Information**:
  - HTTP status code and message
  - Response headers and body
  - Response time
  - Success/error status

- **Timing**:
  - Start time, end time
  - Response time in milliseconds

## Viewing Traces in Jaeger

1. **Open Jaeger UI**: http://localhost:16686
2. **Select Service**: Choose "express-recap" from the service dropdown
3. **Find Traces**: Click "Find Traces"
4. **View Details**: Click on any trace to see:
   - Span timeline
   - Request/response attributes
   - Response data (same structure as Elasticsearch logs)

## Response Data Structure

The response data captured by OpenTelemetry matches the Elasticsearch logger structure:

```json
{
  "http": {
    "statusCode": 201,
    "statusMessage": "Created",
    "statusCategory": "success",
    "statusCodeGroup": "2xx"
  },
  "headers": {...},
  "body": {...},
  "timing": {
    "startTime": "...",
    "endTime": "...",
    "responseTime": "45ms",
    "responseTimeMs": 45
  },
  "success": true,
  "error": null,
  "hasError": false
}
```

## Comparison: Elasticsearch vs OpenTelemetry

| Feature | Elasticsearch Logger | OpenTelemetry |
|---------|---------------------|---------------|
| **Storage** | Elasticsearch index | Jaeger backend |
| **UI** | Kibana | Jaeger UI |
| **Query** | Elasticsearch queries | Jaeger search |
| **Context** | Same structure | Same structure |
| **Tracing** | No | Yes (distributed) |
| **Performance** | Async logging | Span-based |

Both capture the same data structure, so you can use either or both depending on your needs.

## Troubleshooting

### Traces not appearing in Jaeger

1. Check if Jaeger is running: `docker ps | grep jaeger`
2. Verify the endpoint: Check `JAEGER_ENDPOINT` environment variable
3. Check application logs for OpenTelemetry errors
4. Restart the application

### Performance Impact

OpenTelemetry is designed to be low-overhead. The middleware:
- Runs asynchronously
- Uses efficient span creation
- Doesn't block request/response flow

If you notice performance issues, you can disable OpenTelemetry by removing the middleware from routes.

