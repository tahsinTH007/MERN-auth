/**
 * Development Error Handling Middleware
 *
 * Catches all errors thrown in the app and returns detailed
 * information to help during development.
 *
 * Usage: Use this middleware in development **after all routes**.
 *
 * @param {Error} err - The error object thrown
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const ErrorHandler = (err, req, res, next) => {
  console.error("Error stack:", err.stack);
  console.error("Error message:", err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

export default ErrorHandler;
