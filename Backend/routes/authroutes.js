const {beginRegister,register,verify,login} = require('../controller/authController');
const express = require('express');
const isLoggedIn=require('../middleware/isLoggedIn')

const router = express.Router();

router.post('/beginregister', beginRegister);
router.post('/register',register);
router.post('/verify',verify)
router.post('/login',login)
router.post('/check',isLoggedIn);

module.exports = router;