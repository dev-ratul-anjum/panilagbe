const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { validateReview, checkValidation } = require('../middleware/validator');

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post('/', protect, validateReview, checkValidation, reviewController.createReview);

// @route   GET /api/reviews
// @desc    Get all reviews
// @access  Public
router.get('/', reviewController.getAllReviews);

// @route   GET /api/reviews/:id
// @desc    Get review by ID
// @access  Public
router.get('/:id', reviewController.getReviewById);

// @route   PUT /api/reviews/:id
// @desc    Update review
// @access  Private
router.put('/:id', protect, validateReview, checkValidation, reviewController.updateReview);

// @route   DELETE /api/reviews/:id
// @desc    Delete review
// @access  Private
router.delete('/:id', protect, reviewController.deleteReview);

module.exports = router; 