const express = require("express");

// Import routes
const indexRoutes = require("./routes/index");
const healthRoutes = require("./routes/health");
const kafkaRoutes = require("./routes/kafka");
const elasticsearchRoutes = require("./routes/elasticsearch");
const redisRoutes = require("./routes/redis");
const redis2Routes = require("./routes/redis2");
const postgresRoutes = require("./routes/postgres");

const app = express();
app.use(express.json());

// Register routes
app.use("/", indexRoutes);
app.use("/health", healthRoutes);
app.use("/kafka", kafkaRoutes);
app.use("/elasticsearch", elasticsearchRoutes);
app.use("/redis", redisRoutes);
app.use("/redis2", redis2Routes);
app.use("/postgres", postgresRoutes);

module.exports = app;
