/**
 * Wraps an async Express route/controller function and
 * handles any thrown errors with a structured JSON response.
 *
 * This avoids repetitive try/catch in each controller.
 *
 * @param {Function} handler - Async route/controller function
 * @returns {Function} Express-compatible request handler
 */

const TryCatch = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
};

export default TryCatch;
