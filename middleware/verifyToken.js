const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header

  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    // Save decoded data (user info) to request object for access in subsequent routes
    req.user = decoded;
    next();  // Pass control to the next middleware or route handler
  });
};

// Middleware to check if the user has one of the required roles
const checkRole = (requiredRoles) => (req, res, next) => {
  const userRoles = req.user.roles || [];

  // Check if the user has at least one of the required roles
  const hasRole = requiredRoles.some(role => userRoles.includes(role));

  if (!hasRole) {
    return res.status(403).json({ message: 'Access denied. Insufficient role.' });
  }

  next(); // User has the required role, continue to the next middleware or route handler
};

module.exports = { verifyToken, checkRole };
