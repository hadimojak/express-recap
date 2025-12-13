import { createRequire } from "module";
const require = createRequire(import.meta.url);
require("@opentelemetry/api-logs");
const loggerModule = require("./logger.js");
const loggerProvider = loggerModule.loggerProvider;

// Get a logger instance
const otelLogger = loggerProvider.getLogger(process.env.OTEL_SERVICE_NAME, process.env.npm_package_version);

// Map severity levels
// OpenTelemetry Severity Numbers (https://opentelemetry.io/docs/specs/otel/logs/data-model/#field-severitynumber)
const SeverityNumber = {
  TRACE: 1,
  TRACE2: 2,
  TRACE3: 3,
  TRACE4: 4,
  DEBUG: 5,
  DEBUG2: 6,
  DEBUG3: 7,
  DEBUG4: 8,
  INFO: 9,
  INFO2: 10,
  INFO3: 11,
  INFO4: 12,
  WARN: 13,
  WARN2: 14,
  WARN3: 15,
  WARN4: 16,
  ERROR: 17,
  ERROR2: 18,
  ERROR3: 19,
  ERROR4: 20,
  FATAL: 21,
  FATAL2: 22,
  FATAL3: 23,
  FATAL4: 24,
};

// Create otel logger - sends to OpenTelemetry only (not to console)
const otel = {
  log: function (...args) {
    const message = args
      .map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg)))
      .join(" ");

    otelLogger.emit({
      severityNumber: SeverityNumber.INFO,
      severityText: "INFO",
      body: message,
      attributes: {},
    });
  },

  logWithBody: function (...args) {
    const message = args
      .map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg)))
      .join(" ");

    otelLogger.emit({
      severityNumber: SeverityNumber.INFO3,
      severityText: "INFO3",
      body: message,
      attributes: {},
    });
  },

  info: function (...args) {
    const message = args
      .map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg)))
      .join(" ");

    otelLogger.emit({
      severityNumber: SeverityNumber.INFO2,
      severityText: "INFO2",
      body: message,
      attributes: {},
    });
  },

  warn: function (...args) {
    const message = args
      .map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg)))
      .join(" ");

    otelLogger.emit({
      severityNumber: SeverityNumber.WARN,
      severityText: "WARN",
      body: message,
      attributes: {},
    });
  },

  error: function (...args) {
    const message = args
      .map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg)))
      .join(" ");

    otelLogger.emit({
      severityNumber: SeverityNumber.ERROR,
      severityText: "ERROR",
      body: message,
      attributes: {},
    });
  },

  debug: function (...args) {
    const message = args
      .map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg)))
      .join(" ");

    otelLogger.emit({
      severityNumber: SeverityNumber.DEBUG,
      severityText: "DEBUG",
      body: message,
      attributes: {},
    });
  },
};

// Make otel available globally
// globalThis.otel = otel;

export default otel;
