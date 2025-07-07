const addExpense =require('../controller/spController');
const express =require ("express");
const isLoggedIn=require('../middleware/isLoggedIn');


const router=express.Router();

router.post('/addExpense',isLoggedIn,addExpense);

module.exports=router;