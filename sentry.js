import * as Sentry from "@sentry/node";

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || "development",

  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of transactions for testing

  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,

  // Only initialize if DSN is provided
  enabled: !!process.env.SENTRY_DSN,
});

export default Sentry;

