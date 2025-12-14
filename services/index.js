import { Kafka } from "kafkajs";
import redis from "redis";

// ==================== KAFKA CONNECTION ====================
const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "express-app",
  brokers: (process.env.KAFKA_BROKERS || "localhost:9094").split(","),
});

const producer = kafka.producer();
const consumer = kafka.consumer({
  groupId: process.env.KAFKA_CONSUMER_GROUP_ID || "express-group",
});


// ==================== REDIS CONNECTIONS ====================
// Redis 1
const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
  },
  ...(process.env.REDIS_PASSWORD && { password: process.env.REDIS_PASSWORD }),
});


export {
  kafka,
  producer,
  consumer,
  redisClient,
};
