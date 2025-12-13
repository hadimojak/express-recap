import express from "express";
import Sentry from "./sentry.js";

// Import routes
import indexRoutes from "./routes/index.js";
import healthRoutes from "./routes/health.js";
// import kafkaRoutes from "./routes/kafka.js";
import elasticsearchRoutes from "./routes/elasticsearch.js";
import redisRoutes from "./routes/redis.js";
import redis2Routes from "./routes/redis2.js";
import postgresRoutes from "./routes/postgres.js";
import userRoutes from "./routes/user.js";

const app = express();

// Sentry request handler - MUST be first middleware
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(express.json());

// Register routes
app.use("/", indexRoutes);
app.use("/health", healthRoutes);
// app.use("/kafka", kafkaRoutes);
app.use("/elasticsearch", elasticsearchRoutes);
app.use("/redis", redisRoutes);
app.use("/redis2", redis2Routes);
app.use("/postgres", postgresRoutes);
app.use("/user", userRoutes);

// Sentry error handler - MUST be after routes
app.use(Sentry.Handlers.errorHandler());

// Optional fallback error handler
app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: err.message,
  });
});

export default app;
