import {
  LoggerProvider,
  BatchLogRecordProcessor,
} from "@opentelemetry/sdk-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { Resource } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

// Create a resource with your service information
const resource = new Resource({
  [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || "nodejs-console-app",
});

// Configure the OTLP exporter
// It automatically reads OTEL_EXPORTER_OTLP_ENDPOINT and OTEL_EXPORTER_OTLP_HEADERS
const logExporter = new OTLPLogExporter({});

// Create and configure the logger provider
const loggerProvider = new LoggerProvider({
  resource,
  processors: [new BatchLogRecordProcessor(logExporter)], // Configure batch processor
});

export default loggerProvider;
