import express from "express";
import {
  registerUser,
  verifyUser,
  loginUser,
  verifyOtp,
} from "../controllers/user.js";

const router = express.Router();

/**
 * @route   POST /api/v1/register
 * @desc    Register a new user and send verification token / OTP
 * @access  Public
 */
router.post("/register", registerUser);

/**
 * @route   POST /api/v1/verify/:token
 * @desc    Verify user account using email verification token
 * @access  Public
 */
router.post("/verify/:token", verifyUser);

/**
 * @route   POST /api/v1/login
 * @desc    Authenticate user credentials and issue tokens
 * @access  Public
 */
router.post("/login", loginUser);

/**
 * @route   POST /api/v1/verify
 * @desc    Verify OTP (email / phone / 2FA)
 * @access  Public
 */
router.post("/verify", verifyOtp);

export default router;
