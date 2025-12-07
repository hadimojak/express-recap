const { Kafka } = require("kafkajs");
const { Client: ElasticsearchClient } = require("@elastic/elasticsearch");
const redis = require("redis");

// ==================== KAFKA CONNECTION ====================
const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "express-app",
  brokers: (process.env.KAFKA_BROKERS || "localhost:9094").split(","),
});

const producer = kafka.producer();
const consumer = kafka.consumer({
  groupId: process.env.KAFKA_CONSUMER_GROUP_ID || "express-group",
});

// ==================== ELASTICSEARCH CONNECTION ====================
const elasticsearchConfig = {
  node: process.env.ELASTICSEARCH_NODE || "http://localhost:9200",
};

// Add auth if username is provided
if (process.env.ELASTICSEARCH_USERNAME) {
  elasticsearchConfig.auth = {
    username: process.env.ELASTICSEARCH_USERNAME,
    password: process.env.ELASTICSEARCH_PASSWORD || "",
  };
}

const elasticsearchClient = new ElasticsearchClient(elasticsearchConfig);

// ==================== REDIS CONNECTIONS ====================
// Redis 1
const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
  },
  ...(process.env.REDIS_PASSWORD && { password: process.env.REDIS_PASSWORD }),
});

// Redis 2
const redis2Client = redis.createClient({
  socket: {
    host: process.env.REDIS2_HOST || "localhost",
    port: parseInt(process.env.REDIS2_PORT || "6380", 10),
  },
  ...(process.env.REDIS2_PASSWORD && { password: process.env.REDIS2_PASSWORD }),
});

module.exports = {
  kafka,
  producer,
  consumer,
  elasticsearchClient,
  redisClient,
  redis2Client,
};
