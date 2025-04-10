const express = require('express');
const router = express.Router();
const { reserveListing } = require('../controllers/reserveController');

router.post('/reserve/:id', reserveListing);

module.exports = router;
