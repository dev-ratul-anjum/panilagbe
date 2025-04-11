const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const { validateOrder, checkValidation } = require('../middleware/validator');

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
router.post('/', protect, validateOrder, checkValidation, orderController.createOrder);

// @route   GET /api/orders
// @desc    Get all orders for current user
// @access  Private
router.get('/', protect,  orderController.getUserOrders);

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', protect, orderController.getOrderById);

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', protect, authorize('admin'), orderController.updateOrderStatus);

// @route   PUT /api/orders/:id/payment
// @desc    Update payment status
// @access  Private/Admin
router.put('/:id/payment', protect, authorize('admin'), orderController.updatePaymentStatus);

// @route   GET /api/orders/admin/all
// @desc    Get all orders (admin only)
// @access  Private/Admin
router.get('/admin/all', protect, authorize('admin'), orderController.getAllOrders);

// SSLCOMMERZ redirect routes
router.post('/checkout/success/:tranId', orderController.checkoutSuccess);
router.post('/checkout/fail/:tranId', orderController.checkoutFail);
router.post('/checkout/cancel/:tranId', orderController.checkoutCancel);

// get checkout pages
router.get('/payment/success/:tranId', orderController.getCheckoutSuccessPage);
router.get('/payment/fail/:tranId', orderController.getCheckoutFailPage);
router.get('/payment/cancel/:tranId', orderController.getCheckoutCancelPage);

// PAY ORDER
router.post('/pay', protect, orderController.payOrderPayment);

// SSLCOMMERZ payment redirect routes 
router.post('/payment/checkout/success/:tranId', orderController.paymentCheckoutSuccess);



module.exports = router; 