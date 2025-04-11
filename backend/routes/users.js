const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { validateUserRegistration, validateUserLogin, checkValidation  } = require('../middleware/validator');

// @route   POST /api/users/register
// @desc    Register user
// @access  Public
router.post('/register', validateUserRegistration, checkValidation, userController.registerUser);

// @route   POST /api/users/login
// @desc    Login user
// @access  Public
router.post('/login', validateUserLogin, checkValidation, userController.loginUser);

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, userController.getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, userController.updateUserProfile);

const passport = require('passport');

router.get('/me', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    })(req, res, next);
}, userController.getUser);

module.exports = router; 