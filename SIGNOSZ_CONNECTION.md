# SigNoz Connection

## Quick Start

```bash
# Start SigNoz
docker-compose -f docker/docker-compose.yaml up -d

# Start app
npm run dev

# Test
curl -X POST http://localhost:3000/user/create \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com"}'
```

## Endpoints

- **SigNoz UI**: http://localhost:8080
- **OTLP HTTP**: http://localhost:4318/v1/traces
- **OTLP gRPC**: http://localhost:4317

## Verify

```bash
# Check SigNoz is running
docker ps | grep signoz

# Check OTLP endpoint (405 is normal)
curl http://localhost:4318/v1/traces

# Check SigNoz health
curl http://localhost:8080/api/v1/health
```

## View Traces

1. Open http://localhost:8080
2. Go to "Traces"
3. Filter by service: `express-recap`

## Console Logs

```
✅ OpenTelemetry SDK initialized
📡 Sending traces to: http://localhost:4318/v1/traces
📊 OpenTelemetry: Started span for POST /user/create [request-id]
✅ OpenTelemetry: Completed span for POST /user/create [request-id] - Status: 201 (45ms)
```

## Troubleshooting

**Traces not appearing:**
- Check SigNoz logs: `docker logs signoz-otel-collector`
- Check app logs for OpenTelemetry messages
- Verify endpoint: `curl -v http://localhost:4318/v1/traces`

**Port conflicts:**
```bash
sudo lsof -i :4318
sudo lsof -i :8080
```
