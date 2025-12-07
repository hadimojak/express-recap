import express from 'express';
const router = express.Router();
import { redisClient } from '../services/index.js';

router.post('/set', async (req, res) => {
  try {
    const { key, value } = req.body;
    
    if (!key || value === undefined) {
      return res.status(400).json({ error: 'Key and value are required' });
    }

    await redisClient.set(key, JSON.stringify(value));
    res.json({ success: true, message: 'Value set in Redis' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/get/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const value = await redisClient.get(key);
    
    if (value === null) {
      return res.status(404).json({ error: 'Key not found' });
    }

    res.json({ success: true, key, value: JSON.parse(value) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

