import express from "express";
import User from "../models/User.js";
import { validationResult } from "express-validator";
import createUserValidator from "../dto/createUser.dto.js";
import { requestId } from "../middleware/requestId.js";

const router = express.Router();

router.post("/create", requestId, createUserValidator, async (req, res) => {
  try {
    // Tehran is UTC+3:30 (3.5 hours)
    const tehranTime = new Date(Date.now() + 3.5 * 60 * 60 * 1000);

    otel.info("POST /user/create - Request received", {
      requestId: req.requestId,
      body: req.body,
    });

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const response = {
        success: false,
        errors: errors.array(),
      };
      otel.warn("Validation failed - Response sent", {
        requestId: req.requestId,
        status: 400,
        response,
      });
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

    otel.log("User created - Response sent", {
      requestId: req.requestId,
      status: 201,
      response,
    });

    return res.status(201).json(response);
  } catch (error) {
    otel.error("Error creating user", {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
    });

    // Handle unique constraint violation
    if (error.name === "SequelizeUniqueConstraintError") {
      const response = { success: false, error: "Email already exists" };
      otel.warn("Conflict - Response sent", {
        requestId: req.requestId,
        status: 409,
        response,
      });
      return res.status(409).json(response);
    }

    const response = { success: false, error: error.message };
    otel.error("Server error - Response sent", {
      requestId: req.requestId,
      status: 500,
      response,
    });
    res.status(500).json(response);
  }
});

export default router;
