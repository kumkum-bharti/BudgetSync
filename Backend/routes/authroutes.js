const {beginRegister,register,verify,login,getUsers,searchUsers} = require('../controller/authController');
const express = require('express');
const isLoggedIn=require('../middleware/isLoggedIn')

const router = express.Router();

router.post('/beginregister', beginRegister);
router.post('/register',register);
router.post('/verify',verify)
router.post('/login',login)
router.post('/check',isLoggedIn);
router.get('/getUsers',isLoggedIn,getUsers);
router.get('/searchUsers/',isLoggedIn,searchUsers)

module.exports = router;