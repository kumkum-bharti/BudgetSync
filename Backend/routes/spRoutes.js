const {addExpense,addSplitPurchase,addPurchase} =require('../controller/spController');
const express =require ("express");
const isLoggedIn=require('../middleware/isLoggedIn');


const router=express.Router();

router.post('/addExpense',isLoggedIn,addExpense);
router.post('/addsp',isLoggedIn,addSplitPurchase);
router.post('/addPurchase',isLoggedIn,addPurchase);

module.exports=router;