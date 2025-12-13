import process from "process";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import * as opentelemetry from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

const { Resource } = require("@opentelemetry/resources");

const serviceName = process.env.OTEL_SERVICE_NAME;

const exporterOptions = {
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT_TRACE,
};

const traceExporter = new OTLPTraceExporter(exporterOptions);
const sdk = new opentelemetry.NodeSDK({
  traceExporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      // Only enable HTTP and Express instrumentation
      "@opentelemetry/instrumentation-http": { enabled: true },
      "@opentelemetry/instrumentation-express": { enabled: true },
      // Disable everything else
      "@opentelemetry/instrumentation-fs": { enabled: false },
      "@opentelemetry/instrumentation-dns": { enabled: false },
      "@opentelemetry/instrumentation-net": { enabled: false },
      "@opentelemetry/instrumentation-grpc": { enabled: false },
      "@opentelemetry/instrumentation-pg": { enabled: false },
      "@opentelemetry/instrumentation-redis": { enabled: false },
      "@opentelemetry/instrumentation-mongodb": { enabled: false },
      "@opentelemetry/instrumentation-mysql": { enabled: false },
      "@opentelemetry/instrumentation-ioredis": { enabled: false },
    }),
  ],
  resource: new Resource({
    "service.name": serviceName,
  }),
});

// initialize the SDK and register with the OpenTelemetry API
sdk.start();

console.log("✅ OpenTelemetry Tracing initialized");
console.log(`📊 Traces → ${exporterOptions.url}`);
console.log(`🔖 Service: ${serviceName}`);

// gracefully shut down the SDK on process exit
process.on("SIGTERM", () => {
  sdk
    .shutdown()
    .then(() => console.log("Tracing terminated"))
    .catch((error) => console.log("Tracing terminated", error))
    .finally(() => process.exit(0));
});
