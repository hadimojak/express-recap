import express from "express";
import User from "../models/User.js";
import { validationResult } from "express-validator";
import createUserValidator from "../dto/createUser.dto.js";
import { requestId } from "../middleware/requestId.js";
import Sentry from "../sentry.js";

const router = express.Router();

router.post("/create", requestId, createUserValidator, async (req, res) => {
  try {
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
  } catch (error) {
    // Capture error in Sentry
    Sentry.captureException(error, {
      tags: {
        route: "/user/create",
        method: "POST",
      },
      extra: {
        requestId: req.requestId,
        body: req.body,
      },
    });

    console.error("Error creating user:", error);

    res.status(500).json({
      success: false,
      error: "Failed to create user",
      message: error.message,
      requestId: req.requestId,
    });
  }
});

// Test route to trigger Sentry error
router.get("/test-error", (req, res) => {
  throw new Error("This is a test error for Sentry!");
});

export default router;
