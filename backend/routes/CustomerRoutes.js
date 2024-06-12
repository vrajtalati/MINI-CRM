const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/CustomerController');

router.get('/customers', CustomerController.getAllCustomers);
router.post('/customers', CustomerController.createCustomer);
router.delete('/customers/:id', CustomerController.deleteCustomer);
router.post('/customers/check-audience-size', CustomerController.checkAudienceSize);

module.exports = router;
