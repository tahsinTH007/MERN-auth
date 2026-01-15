import { z } from "zod";

/**
 * Register Schema
 *
 * Validates the request body for user registration.
 * Ensures proper types, lengths, and formats.
 *
 * Fields:
 *  - name: string, minimum 3 characters
 *  - email: string, must be a valid email
 *  - password: string, minimum 6 characters
 *
 * Usage:
 * import { registerSchema } from "../validators/user.validation.js";
 * const parsedData = registerSchema.parse(req.body); // throws if invalid
 */
export const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(3, { message: "Name must be at least 3 characters long" })
    .trim(),

  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" })
    .trim()
    .toLowerCase(),

  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters long" }),
});
