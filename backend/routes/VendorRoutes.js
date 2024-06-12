
const express = require('express');
const router = express.Router();

// Dummy Vendor API to simulate message sending
router.post('/vendor/send-message', (req, res) => {
  const { name, email } = req.body;
  const success = Math.random() > 0.2; // 80% success rate

  if (success) {
    res.json({ status: 'SENT' });
  } else {
    res.status(500).json({ status: 'FAILED' });
  }
});

module.exports = router;
