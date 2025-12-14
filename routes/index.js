import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Express app connected to all services",
    endpoints: {
      health: "/health",
      kafka: {
        produce: "POST /kafka/produce",
        consume: "POST /kafka/consume",
      },
      redis: {
        set: "POST /redis/set",
        get: "GET /redis/get/:key",
      },
      postgres: {
        query: "POST /postgres/query",
        tables: "GET /postgres/tables",
      },
    },
  });
});

export default router;

