const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// @route   GET /api/customers
// @desc    Get all customers
// @access  Public
router.get('/customers', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/customers
// @desc    Create a customer
// @access  Public
router.post('/customers', async (req, res) => {
  const { name, email, total_spends, visits } = req.body;
  try {
    const newCustomer = new Customer({
      name,
      email,
      total_spends,
      visits,
    });

    const customer = await newCustomer.save();
    res.json(customer);
  } catch (err) {
    res.status(500).send(err);
  }
});

// @route   DELETE /api/customers/:id
// @desc    Delete a customer
// @access  Public
router.delete('/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ msg: 'Customer not found' });
    }

    await customer.remove();
    res.json({ msg: 'Customer removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/customers/check-audience-size
// @desc    Check audience size based on rules
// @access  Public
router.post('/customers/check-audience-size', async (req, res) => {
  const { rules } = req.body;
  try {
    const query = buildQuery(rules);
    const audienceSize = await Customer.countDocuments(query);
    res.json({ audienceSize });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

const buildQuery = (rules) => {
  const query = {};
  const andConditions = [];
  const orConditions = [];

  rules.forEach((rule, index) => {
    const condition = {};
    switch (rule.operator) {
      case '>':
        condition[rule.field] = { $gt: rule.value };
        break;
      case '<':
        condition[rule.field] = { $lt: rule.value };
        break;
      case '=':
        condition[rule.field] = rule.value;
        break;
      default:
        break;
    }

    if (rule.logical === 'OR' && index !== 0) {
      orConditions.push(condition);
    } else {
      andConditions.push(condition);
    }
  });

  if (orConditions.length > 0) {
    query.$or = orConditions;
  }

  if (andConditions.length > 0) {
    query.$and = andConditions;
  }

  return query;
};

module.exports = router;
