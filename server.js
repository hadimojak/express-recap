// Load environment variables first
import "dotenv/config";

import app from "./app.js";
import {
  producer,
  consumer,
  redisClient,
  redis2Client,
  elasticsearchClient,
} from "./services/index.js";
import sequelize from "./config/database.js";

const PORT = process.env.PORT || 3000;

// ==================== INITIALIZE CONNECTIONS ====================
async function initializeConnections() {
  try {
    // Connect Kafka producer
    await producer.connect();
    console.log("✅ Kafka producer connected");

    // Connect Kafka consumer
    await consumer.connect();
    console.log("✅ Kafka consumer connected");

    // Connect Redis clients
    await redisClient.connect();
    console.log("✅ Redis 1 connected");

    await redis2Client.connect();
    console.log("✅ Redis 2 connected");

    // Test PostgreSQL connection
    await sequelize.authenticate({});
    await sequelize.sync({ alter: true });
    console.log("✅ PostgreSQL connected via Sequelize");

    // Test Elasticsearch connection
    const esHealth = await elasticsearchClient.cluster.health();
    console.log("✅ Elasticsearch connected:", esHealth.status);

    console.log("🚀 All services connected successfully!");
  } catch (error) {
    console.error("❌ Connection error:", error.message);
    // Don't exit, allow app to start and show health check failures
  }
}

// ==================== START SERVER ====================
app.listen(PORT, async () => {
  console.log(`🚀 Express server running on http://localhost:${PORT}`);
  await initializeConnections();
});

// ==================== GRACEFUL SHUTDOWN ====================
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully...");
  await producer.disconnect();
  await consumer.disconnect();
  await redisClient.quit();
  await redis2Client.quit();
  await sequelize.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully...");
  await producer.disconnect();
  await consumer.disconnect();
  await redisClient.quit();
  await redis2Client.quit();
  await sequelize.close();
  process.exit(0);
});
