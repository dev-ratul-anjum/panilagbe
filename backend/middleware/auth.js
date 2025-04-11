const passport = require('passport');

// Middleware to protect routes
exports.protect = passport.authenticate('jwt', { session: false });

// Role-based authorization middleware
exports.authorize = role => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action' });
    }
    
    next();
  };
}; 