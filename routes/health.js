const express = require('express');
const router = express.Router();
const { kafka, elasticsearchClient, redisClient, redis2Client } = require('../services');
const sequelize = require('../config/database');

router.get('/', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {}
  };

  // Check Kafka
  try {
    const admin = kafka.admin();
    await admin.connect();
    await admin.disconnect();
    health.services.kafka = { status: 'connected' };
  } catch (error) {
    health.services.kafka = { status: 'error', error: error.message };
  }

  // Check Elasticsearch
  try {
    const esHealth = await elasticsearchClient.cluster.health();
    health.services.elasticsearch = { status: 'connected', cluster: esHealth.status };
  } catch (error) {
    health.services.elasticsearch = { status: 'error', error: error.message };
  }

  // Check Redis 1
  try {
    await redisClient.ping();
    health.services.redis = { status: 'connected' };
  } catch (error) {
    health.services.redis = { status: 'error', error: error.message };
  }

  // Check Redis 2
  try {
    await redis2Client.ping();
    health.services.redis2 = { status: 'connected' };
  } catch (error) {
    health.services.redis2 = { status: 'error', error: error.message };
  }

  // Check PostgreSQL
  try {
    await sequelize.authenticate();
    health.services.postgresql = { status: 'connected' };
  } catch (error) {
    health.services.postgresql = { status: 'error', error: error.message };
  }

  const allHealthy = Object.values(health.services).every(s => s.status === 'connected');
  health.status = allHealthy ? 'ok' : 'degraded';

  res.json(health);
});

module.exports = router;

