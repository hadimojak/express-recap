import express from "express";
// import User from "../models/User.js";
import { validationResult } from "express-validator";
import createUserValidator from "../dto/createUser.dto.js";
import { requestId } from "../middleware/requestId.js";


const router = express.Router();
const users = [];

router.post(
  "/create",
  requestId,
  createUserValidator,
  async (req, res) => {
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
      // const user = await User.create({ name, email });

      const user = { id: users.length + 1, name, email };
      users.push(user);


      return res.status(201).json({
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
  }
);

export default router;
