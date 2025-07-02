const {beginRegister,register,verify,login} = require('../controller/authController');
const express = require('express');

const router = express.Router();

router.post('/beginregister', beginRegister);
router.post('/register',register);
router.post('/verify',verify)
router.post('/login',login)

module.exports = router;