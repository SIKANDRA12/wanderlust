const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware.js');  // if you have this
const { reserveListing } = require('../controllers/reserveController.js');

// Protecting Route (Optional but recommended)
router.post('/reserve/:id', isLoggedIn, reserveListing);

module.exports = router;
