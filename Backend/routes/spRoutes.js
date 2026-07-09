const { addExpense, addSplitPurchase, addPurchase, editRequest, reviewRequest, getRequests, getExpenses, getPurchases, getSp, editSp, deletePurchase, deleteSp, getAnalytics, getExpenseSummary } = require('../controller/spController');
const express = require("express");
const isLoggedIn = require('../middleware/isLoggedIn');


const router = express.Router();

router.post('/addExpense', isLoggedIn, addExpense);
router.post('/addsp', isLoggedIn, addSplitPurchase);
router.post('/addPurchase', isLoggedIn, addPurchase);
router.post('/editRequest', isLoggedIn, editRequest);
router.post('/reviewRequest', isLoggedIn, reviewRequest);
router.get('/getRequests', isLoggedIn, getRequests);
router.get('/getExpenses', isLoggedIn, getExpenses);
router.get('/getPurchases', isLoggedIn, getPurchases);
router.get('/getSp', isLoggedIn, getSp);
router.get('/getAnalytics', isLoggedIn, getAnalytics);
router.get('/getExpenseSummary', isLoggedIn, getExpenseSummary);
router.post('/editSp', isLoggedIn, editSp);
router.delete('/deletePurchase', isLoggedIn, deletePurchase);
router.delete('/deleteSp', isLoggedIn, deleteSp);

module.exports = router;