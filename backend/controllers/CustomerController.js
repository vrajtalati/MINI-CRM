const Customer = require('../models/Customer');
const { publishToQueue } = require('../rabbitmq');

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.createCustomer = async (req, res) => {
  const { name, email, total_spends, visits } = req.body;
  try {
    const newCustomer = new Customer({
      name,
      email,
      total_spends,
      visits,
    });

    const customer = await newCustomer.save();

    // Publish message to RabbitMQ
    publishToQueue('customer_created', JSON.stringify(customer));

    res.json(customer);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ msg: 'Customer not found' });
    }

    await customer.remove();

    // Publish message to RabbitMQ
    publishToQueue('customer_deleted', JSON.stringify(customer));

    res.json({ msg: 'Customer removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.checkAudienceSize = async (req, res) => {
  const { rules } = req.body;
  try {
    const query = buildQuery(rules);
    const audienceSize = await Customer.countDocuments(query);
    res.json({ audienceSize });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

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
