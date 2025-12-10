import { createRequire } from "module";
const require = createRequire(import.meta.url);
const {
  LoggerProvider,
  BatchLogRecordProcessor,
} = require("@opentelemetry/sdk-logs/build/src/index.js");
const { OTLPLogExporter } = require("@opentelemetry/exporter-logs-otlp-http");
const { Resource } = require("@opentelemetry/resources");

// Create a resource with your service information
const resource = new Resource({
  "service.name": process.env.OTEL_SERVICE_NAME || "express-recap",
});

// Configure the OTLP exporter
// It automatically reads OTEL_EXPORTER_OTLP_ENDPOINT and OTEL_EXPORTER_OTLP_HEADERS
const logExporter = new OTLPLogExporter({});

// Create and configure the logger provider
const loggerProvider = new LoggerProvider({
  resource,
  processors: [new BatchLogRecordProcessor(logExporter)],
});

export { loggerProvider };
