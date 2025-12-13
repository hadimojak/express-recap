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


    // Handle unique constraint violatio
    res.status(500).json(error);
  }
});

export default router;
