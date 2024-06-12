const mongoose = require('mongoose');

const CommunicationLogSchema = new mongoose.Schema({
  campaign_name: {
    type: String,
    required: true,
  },
  rules: [
    {
      field: String,
      operator: String,
      value: String,
      logical: String,
    },
  ],
  audience: [
    {
      name: String,
      email: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('CommunicationLog', CommunicationLogSchema);
