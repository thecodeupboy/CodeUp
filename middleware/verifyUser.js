const jwt = require('jsonwebtoken');

const verifyToken = ({headers}) => {
  const token = headers?.authorization?.split(' ')[1];
  if (!token) {
    throw new Error("Authentication required");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    throw new Error("Invalid or expired token.");
  }
};

const checkRole = (user, requiredRoles) => {
  const userRoles = Array.isArray(user?.roles) ? user.roles : [];

  if (userRoles.length === 0) {
    throw new Error('Access denied. No roles found.');
  }

  const hasRole = requiredRoles.some(role => userRoles.includes(role));

  if (!hasRole) {
    throw new Error('Access denied. Insufficient role.');
  }

  return true;
};

const checkAuth = (user) => {
  if (user?.status === 'suspended') {
    throw new Error('User status is suspended');
  }

  return true;
};

module.exports = { verifyToken, checkRole, checkAuth };
