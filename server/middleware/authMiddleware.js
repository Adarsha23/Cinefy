// /server/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // 1. Check if they sent a token in the headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. The header format is "Bearer <token>", so we split by space and grab the 2nd part
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Attach the user's ID and role to the request so the next function can use it!
      req.user = decoded;

      // 5. Let them pass to the actual route!
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized. Token failed." });
    }
  }

  // If no token was sent at all
  if (!token) {
    res.status(401).json({ message: "Not authorized. No token provided." });
  }
};

module.exports = { protect };
