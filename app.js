import express from "express";
import "./sentry.js"; // Initialize Sentry
import * as Sentry from "@sentry/node";

// Import routes
import indexRoutes from "./routes/index.js";
import healthRoutes from "./routes/health.js";
import kafkaRoutes from "./routes/kafka.js";
import redisRoutes from "./routes/redis.js";
import postgresRoutes from "./routes/postgres.js";
import userRoutes from "./routes/user.js";

const app = express();


app.use(express.json());

// Register routes
app.use("/", indexRoutes);
app.use("/health", healthRoutes);
app.use("/kafka", kafkaRoutes);
app.use("/redis", redisRoutes);
app.use("/postgres", postgresRoutes);
app.use("/user", userRoutes);

// Optional fallback error handler
Sentry.setupExpressErrorHandler(app);

app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: err.message,
  });
});

export default app;
