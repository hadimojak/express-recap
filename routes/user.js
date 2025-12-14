import express from "express";
import User from "../models/User.js";
import { validationResult } from "express-validator";
import createUserValidator from "../dto/createUser.dto.js";
import { requestId } from "../middleware/requestId.js";
import Sentry from "../sentry.js";

const router = express.Router();

router.post("/create", requestId, createUserValidator, async (req, res) => {
  // Tehran is UTC+3:30 (3.5 hours)
  const tehranTime = new Date(Date.now() + 3.5 * 60 * 60 * 1000);


  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const response = {
      success: false,
      errors: errors.array(),
    };
    return res.status(400).json(response);
  }

  const { name, email } = req.body;


  Sentry.logger.trace("Starting database connection", { database: "users" });
  Sentry.logger.debug("Cache miss for user", { userId: 123 });
  Sentry.logger.info("Updated profile", { profileId: 345 });
  Sentry.logger.warn("Rate limit reached for endpoint", {
    endpoint: "/api/results/",
    isEnterprise: false,
  });
  Sentry.logger.error("Failed to process payment", {
    orderId: "order_123",
    amount: 99.99,
  });
  Sentry.logger.fatal("Database connection pool exhausted", {
    database: "users",
    activeConnections: 100,
  });

  const user = await User.create({
    name,
    email,
    createdAt: tehranTime,
    updatedAt: tehranTime,
  });

  const response = {
    success: true,
    message: "User created successfully",
    requestId: req.requestId,
    user,
  };


  return res.status(201).json(response);

});


export default router;
