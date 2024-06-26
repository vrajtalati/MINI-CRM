const Order = require('../models/Order');
const Customer = require('../models/Customer');
const { publishToQueue } = require('../rabbitmq');

exports.createOrder = async (req, res) => {
  const { customer_id, amount, order_date } = req.body;
  try {
    const order = new Order({ customer_id, amount, order_date });
    await order.save();

    // Update the customer's total_spends
    const updatedCustomer = await Customer.findByIdAndUpdate(
      customer_id,
      { $inc: { total_spends: amount, visits: 1 } },
      { new: true }
    );

    // Publish message to RabbitMQ
    publishToQueue('order_created', JSON.stringify(order));

    res.status(201).send(order);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('customer_id');
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getOrdersByCustomerId = async (req, res) => {
  try {
    const orders = await Order.find({ customer_id: req.params.customerId });
    res.status(200).send(orders);
  } catch (error) {
    res.status (500).send(error);
  }
};
