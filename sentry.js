import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

// Initialize Sentry (always initialize to make Handlers available)
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || "development",
  integrations: [nodeProfilingIntegration()],
  enableLogs: true,

  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of transactions for testing

  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profileSessionSampleRate: 1.0,
  profilesSampleRate: 1.0,
  profileLifecycle: "trace",
  sendDefaultPii: true,
});

Sentry.startSpan({ name: "my span" }, () => { });

export default Sentry;

