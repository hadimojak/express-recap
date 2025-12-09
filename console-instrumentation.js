import { createRequire } from "module";
const require = createRequire(import.meta.url);
require("@opentelemetry/api-logs");
const loggerModule = require("./logger.js");
const loggerProvider = loggerModule.default;

// Get a logger instance
const otelLogger = loggerProvider.getLogger("default", "1.0.0");

// Map severity levels
const SeverityNumber = {
  DEBUG: 5,
  INFO: 9,
  WARN: 13,
  ERROR: 17,
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

  info: function (...args) {
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
globalThis.otel = otel;

export default otel;
