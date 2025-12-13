import express from "express";
const router = express.Router();
import { elasticsearchClient } from "../services/index.js";

router.post("/index", async (req, res) => {
  try {
    const { index, document } = req.body;

    if (!index || !document) {
      return res.status(400).json({ error: "Index and document are required" });
    }

    const result = await elasticsearchClient.index({
      index,
      document,
    });

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/search/:index", async (req, res) => {
  try {
    const { index } = req.params;
    const { q } = req.query;

    const result = await elasticsearchClient.search({
      index,
      query: q ? { match: { _all: q } } : { match_all: {} },
    });

    res.json({ success: true, result: result.hits });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

