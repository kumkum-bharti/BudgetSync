const {beginRegister,register,verify} = require('../controller/authController');
const express = require('express');

const router = express.Router();

router.post('/beginregister', beginRegister);
router.post('/register',register);
router.post('/verify',verify)

module.exports = router;