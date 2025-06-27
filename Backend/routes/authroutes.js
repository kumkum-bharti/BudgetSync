const {beginRegister,register} = require('../controller/authController');
const express = require('express');

const router = express.Router();

router.post('/beginregister', beginRegister);
router.post('/register',register);

module.exports = router;