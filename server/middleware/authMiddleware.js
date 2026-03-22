const jwt = require('jsonwebtoken');

/**
 * Access protection middleware
 * Verifies JWT token from Authorization header (Bearer token)
 */
const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from "Bearer <TOKEN>"
      token = req.headers.authorization.split(' ')[1];

      // Decode and verify against secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user payload (id, role, etc) to request
      req.user = decoded;
      return next();
    } catch (error) {
      console.error("JWT Verification Failure:", error.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }
};

/**
 * Role-based authorization middleware
 * Ensures the authenticated user has ADMIN privileges
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: Admin access required" });
  }
};

module.exports = { protect, adminOnly };
