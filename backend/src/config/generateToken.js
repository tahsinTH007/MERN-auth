import jwt from "jsonwebtoken";
import { redisClient } from "../index.js";

/**
 * Token expiration configuration
 */
const ACCESS_TOKEN_EXPIRES_IN = "1m"; // JWT expiry
const REFRESH_TOKEN_EXPIRES_IN = "7d"; // JWT expiry

const ACCESS_COOKIE_MAX_AGE = 1 * 60 * 1000; // 1 minute (ms)
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days (ms)

/**
 * Generates JWT access & refresh tokens,
 * stores refresh token in Redis,
 * and attaches both tokens as HTTP-only cookies.
 *
 * @param {string} userId - Authenticated user's ID
 * @param {object} res - Express response object
 * @returns {Promise<{ accessToken: string, refreshToken: string }>}
 */
export const generateToken = async (userId, res) => {
  try {
    /* -------------------- Generate Tokens -------------------- */

    const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });

    /* -------------------- Store Refresh Token in Redis -------------------- */

    const refreshTokenKey = `refresh_token:${userId}`;

    await redisClient.setEx(
      refreshTokenKey,
      7 * 24 * 60 * 60, // TTL in seconds
      refreshToken
    );

    /* -------------------- Set Cookies -------------------- */

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: ACCESS_COOKIE_MAX_AGE,
      // secure: process.env.NODE_ENV === "production",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      maxAge: REFRESH_COOKIE_MAX_AGE,
      // secure: process.env.NODE_ENV === "production",
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Token generation failed:", error);
    throw new Error("Failed to generate authentication tokens");
  }
};
