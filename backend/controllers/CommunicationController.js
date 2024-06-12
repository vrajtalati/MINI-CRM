const Customer = require('../models/Customer');
const CommunicationLog = require('../models/CommunicationLog');
const { publishToQueue } = require('../rabbitmq');
const axios = require('axios');

exports.saveCommunicationLog = async (req, res) => {
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

    // Publish message to RabbitMQ
    publishToQueue('communication_log', JSON.stringify(savedLog));

    res.json(savedLog);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.getCommunicationLogs = async (req, res) => {
  try {
    const logs = await CommunicationLog.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};



exports.sendBulkMessages = async (req, res) => {
    const { communicationLogId } = req.body;

    try {
        const communicationLog = await CommunicationLog.findById(communicationLogId);

        if (!communicationLog) {
            return res.status(404).send('Communication Log not found');
        }

        const audience = communicationLog.audience;

        // Send messages in bulk
        const results = await Promise.all(audience.map(async (audienceMember) => {
            try {
                const response = await axios.post('http://localhost:3000/vendor/send-message', {
                    name: audienceMember.name,
                    email: audienceMember.email
                });

                return { ...audienceMember, status: response.data.status };
            } catch (error) {
                return { ...audienceMember, status: 'FAILED' };
            }
        }));

        // Update communication log with results
        communicationLog.audience = results;
        await communicationLog.save();

        res.json({ status: 'Messages sent', results });
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
