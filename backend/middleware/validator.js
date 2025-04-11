const { body, validationResult } = require('express-validator');

// User registration validation
exports.validateUserRegistration = [
  body('name', 'Name is required').notEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  body('phone', 'Phone number is required').notEmpty(),
  body('address', 'Address is required').notEmpty()
];

// User login validation
exports.validateUserLogin = [
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password is required').exists()
];

// Order validation
exports.validateOrder = [
  body('items', 'Items are required').isArray({ min: 1 }),
  body('items.*.waterType', 'Water type is required').notEmpty(),
  body('items.*.waterQuantity', 'Water quantity is required').notEmpty(),
  body('name', 'Name is required').notEmpty(),
  body('email', 'Email is required').notEmpty(),
  body('deliveryAddress', 'Delivery address is required').notEmpty(),
  body('phoneNumber', 'Phone number is required').notEmpty().isMobilePhone().withMessage('Please enter a valid phone number'),
  body('totalAmount', 'Total amount is required').isNumeric()
];

// Review validation
exports.validateReview = [
  body('comment', 'Review text is required').notEmpty(),
  body('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 })
];

// Middleware to check validation results
exports.checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: mappedErrors });
  }
  next();
}; 