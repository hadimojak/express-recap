import express from "express";
import User from "../models/User.js";
import { validationResult } from "express-validator";
import createUserValidator from "../dto/createUser.dto.js";
import { requestId } from "../middleware/requestId.js";
import { openTelemetryLogger } from "../middleware/openTelemetryLogger.js";

const router = express.Router();

router.post("/create", requestId, openTelemetryLogger(), createUserValidator, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { name, email } = req.body;

    // Create user
    const user = await User.create({ name, email });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      requestId: req.requestId,
      user,
    });
  } catch (error) {
    // Handle unique constraint violation
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        success: false,
        error: "Email already exists",
      });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
