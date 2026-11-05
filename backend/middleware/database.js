const mongoose = require("mongoose");

module.exports = (_req, res, next) => {
  if (mongoose.connection.readyState === 1) return next();

  return res.status(503).json({
    message: "Database unavailable. Please try again later.",
  });
};
