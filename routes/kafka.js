const express = require('express');
const router = express.Router();
const { producer, consumer } = require('../services');

router.post('/produce', async (req, res) => {
  try {
    const { topic, message } = req.body;
    
    if (!topic || !message) {
      return res.status(400).json({ error: 'Topic and message are required' });
    }

    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }]
    });

    res.json({ success: true, message: 'Message sent to Kafka' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/consume', async (req, res) => {
  try {
    const { topic } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    await consumer.subscribe({ topic, fromBeginning: false });
    
    const messages = [];
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        messages.push({
          topic,
          partition,
          offset: message.offset,
          value: message.value.toString()
        });
      }
    });

    // Wait a bit for messages
    setTimeout(() => {
      res.json({ success: true, messages });
    }, 2000);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

