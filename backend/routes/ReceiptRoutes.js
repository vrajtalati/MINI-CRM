
const express = require('express');
const router = express.Router();
const CommunicationLog = require('../models/CommunicationLog');

// Endpoint to handle delivery receipt and update communication log status
router.post('/receipt/delivery-receipt', async (req, res) => {
  const { communicationLogId, email, status } = req.body;

  try {
    const communicationLog = await CommunicationLog.findById(communicationLogId);

    if (!communicationLog) {
      return res.status(404).send('Communication Log not found');
    }

    const audienceMember = communicationLog.audience.find(a => a.email === email);
    if (audienceMember) {
      audienceMember.status = status;
      await communicationLog.save();
      res.json({ status: 'Updated' });
    } else {
      res.status(404).send('Audience member not found');
    }
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
