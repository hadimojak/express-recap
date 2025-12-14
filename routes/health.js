import express from "express";
const router = express.Router();
import { kafka, redisClient  } from "../services/index.js";
import sequelize from "../config/database.js";

router.get("/", async (req, res) => {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {},
  };

  // Check Kafka
  try {
    const admin = kafka.admin();
    await admin.connect();
    await admin.disconnect();
    health.services.kafka = { status: "connected" };
  } catch (error) {
    health.services.kafka = { status: "error", error: error.message };
  }


  // Check Redis 1
  try {
    await redisClient.ping();
    health.services.redis = { status: "connected" };
  } catch (error) {
    health.services.redis = { status: "error", error: error.message };
  }


  // Check PostgreSQL
  try {
    await sequelize.authenticate();
    health.services.postgresql = { status: "connected" };
  } catch (error) {
    health.services.postgresql = { status: "error", error: error.message };
  }

  const allHealthy = Object.values(health.services).every(s => s.status === "connected");
  health.status = allHealthy ? "ok" : "degraded";

  res.json(health);
});

export default router;

