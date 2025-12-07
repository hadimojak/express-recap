const express = require("express");
const router = express.Router();
const sequelize = require("../config/database");

router.post("/query", async (req, res) => {
  try {
    const { query, replacements } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const [results, metadata] = await sequelize.query(query, {
      replacements: replacements || [],
    });

    res.json({
      success: true,
      rows: results,
      rowCount: metadata.rowCount || results.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/tables", async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    res.json({ success: true, tables: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
