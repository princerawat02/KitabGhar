const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.cookies.kitabghar_token;

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      message: "Authentication required.",
    });
  }

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user ID to request
    req.userId = decoded.id;

    // Continue to controller
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Your session has expired.",
    });
  }
};
