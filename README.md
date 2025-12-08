# express-recap

Express app with OpenTelemetry tracing via SigNoz

## Quick Start

```bash
# Install dependencies
npm install

# Start SigNoz (from docker folder)
docker-compose -f docker/docker-compose.yaml up -d

# Start application
npm run dev
```

## Access

- **API**: http://localhost:3000
- **SigNoz UI**: http://localhost:8080
- **OTLP Endpoint**: http://localhost:4318/v1/traces

## API Endpoints

- `GET /` - API information
- `GET /health` - Health check
- `POST /user/create` - Create user (with validation and OpenTelemetry tracing)

## Configuration

```bash
# OpenTelemetry
OTEL_SERVICE_NAME=express-recap
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318/v1/traces
```

## View Traces

1. Open http://localhost:8080
2. Navigate to "Traces"
3. Filter by service: `express-recap`

## Troubleshooting

**SigNoz not running:**
```bash
docker-compose -f docker/docker-compose.yaml ps
docker-compose -f docker/docker-compose.yaml logs signoz
```

**Traces not appearing:**
```bash
# Check OTLP endpoint
curl http://localhost:4318/v1/traces

# Check application logs for OpenTelemetry initialization
npm run dev
```
