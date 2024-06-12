const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const CommunicationLog = require('../models/CommunicationLog');
// @route   POST /api/communication-log
// @desc    Save audience to communication log
// @access  Public
router.post('/communication-log', async (req, res) => {
  const { campaign_name, rules } = req.body;
  try {
    const query = buildQuery(rules);
    const customers = await Customer.find(query, 'name email');
    const audience = customers.map(customer => ({
      name: customer.name,
      email: customer.email,
    }));

    const newLog = new CommunicationLog({
      campaign_name,
      rules,
      audience,
    });
    const savedLog = await newLog.save();
    res.json(savedLog);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});



// @route   GET /api/communication-logs
// @desc    Get all communication logs
// @access  Public
router.get('/communication-logs', async (req, res) => {
    try {
      const logs = await CommunicationLog.find().sort({ createdAt: -1 }); // Sort by creation date descending
      res.json(logs);
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
