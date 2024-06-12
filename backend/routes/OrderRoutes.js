const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Customer = require('../models/Customer');

// Create a new order
router.post('/orders', async (req, res) => {
    const { customer_id, amount, order_date } = req.body;
    try {
        const order = new Order({ customer_id, amount, order_date });
        await order.save();

        // Update the customer's total_spends
        await Customer.findByIdAndUpdate(
            customer_id,
            { $inc: { total_spends: amount, visits: 1 } },
            { new: true }
        );

        res.status(201).send(order);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all orders
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find().populate('customer_id');
        res.status(200).send(orders);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get orders by customer ID
router.get('/orders/customer/:customerId', async (req, res) => {
    try {
        const orders = await Order.find({ customer_id: req.params.customerId });
        res.status(200).send(orders);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
