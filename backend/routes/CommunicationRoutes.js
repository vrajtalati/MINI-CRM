
const express = require('express');
const router = express.Router();
const CommunicationController = require('../controllers/CommunicationController');

router.post('/communication-log', CommunicationController.saveCommunicationLog);
router.get('/communication-logs', CommunicationController.getCommunicationLogs);


module.exports = router;
