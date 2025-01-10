const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.cookies.authToken || req.headers['authorization']?.split(' ')[1]; // Get token from cookies or Authorization header

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
const checkRole = (requiredRoles) => {
  return (req, res, next) => {
    const userRoles = req.user?.roles || [];  // Make sure req.user exists and has roles

    if (!userRoles || userRoles.length === 0) {
      return res.status(403).json({ message: 'Access denied. No roles found.' });
    }

    // Check if the user has at least one of the required roles
    const hasRole = requiredRoles.some(role => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({ message: 'Access denied. Insufficient role.' });
    }

    next(); // User has the required role, continue to the next middleware or route handler
  };
};

const checkAuth = (req, res, next) => {
  if (req.user.status === 'suspended') {
    return res.redirect('/userUnauthorised');
  }
  next();
};

module.exports = { verifyToken, checkRole, checkAuth };
