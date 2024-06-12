const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');

router.post('/orders', OrderController.createOrder);
router.get('/orders', OrderController.getAllOrders);
router.get('/orders/customer/:customerId', OrderController.getOrdersByCustomerId);

module.exports = router;
