import sanitize from "mongo-sanitize";
import bcrypt from "bcrypt";
import crypto from "node:crypto";

import TryCatch from "../utils/TryCatch.js";
import { registerSchema } from "../validators/zod.js";
import { redisClient } from "../index.js";
import User from "../models/user.js";
import sendMail from "../config/sendMail.js";
import { getVerifyEmailHtml } from "../config/html.js";

export const registerUser = TryCatch(async (req, res) => {
  const sanitizedBody = sanitize(req.body);

  const validation = registerSchema.safeParse(sanitizedBody);

  if (!validation.success) {
    const errors = validation.error.issues.reduce((acc, issue) => {
      acc[issue.path[0]] = {
        message: issue.message,
        code: issue.code,
      };
      return acc;
    }, {});

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  const { name, email, password } = validation.data;

  const rateLimitKey = `register-rate-limit:${req.ip}:${req.email}`;

  if (await redisClient.get(rateLimitKey)) {
    return res.status(429).json({
      success: false,
      message: "Too many requests, try again later",
    });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400).json({
      success: false,
      message: "User already exist",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const verifyToken = crypto.randomBytes(32).toString("hex");

  const verifyKey = `verify:${verifyToken}`;

  const dataToStore = JSON.stringify({
    name,
    email,
    password: hashPassword,
  });

  await redisClient.set(verifyKey, dataToStore, {
    EX: 300,
  });

  const subject = "Verify Your Email fo Account Creation";
  const html = getVerifyEmailHtml({ email, token: verifyToken });

  await sendMail({ email, subject, html });

  await redisClient.set(rateLimitKey, "true", { EX: 60 });

  res.json({
    message:
      "If your email is valid, a verification link has been sent. It will expire in 5 minute.",
  });
});

export const verifyUser = TryCatch(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    res.status(400).json({
      message: "Verification token in required.",
    });
  }

  const verifyKey = `verify:${token}`;

  const userDataJson = await redisClient.get(verifyKey);

  if (!userDataJson) {
    res.status(400).json({
      message: "Verification link is expired.",
    });
  }

  await redisClient.del(verifyKey);

  const userData = JSON.parse(userDataJson);

  const existingUser = await User.findOne({ email: userData.email });

  if (existingUser) {
    res.status(400).json({
      success: false,
      message: "User already exist",
    });
  }

  const newUser = await User.create({
    name: userData.name,
    email: userData.email,
    password: userData.password,
  });

  res.status(200).json({
    message: "Email Verified successfully! Your account has been created.",
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
  });
});
