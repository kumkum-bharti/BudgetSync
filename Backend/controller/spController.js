const Expense = require('../models/Expenses');
const User = require('../models/User');
const splitPurchase = require('../models/sp');
const Purchase = require('../models/Purchases');
const Request = require('../models/request');


function isValidGST(gstin) {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gstin);
}

const addExpense = async (req, res) => {
    try {
        const { name,title, expenseAmount, user, category, paymentMode, GSTNumber, BillNumber, purchaseId } = req.body;

        if (!name || !title || !expenseAmount || !user || !GSTNumber || !BillNumber || !purchaseId) {
            return res.status(400).json({ message: "Please fill the required fields" });
        }


        const person = await User.findById(user);
        if (!person) {
            return res.status(404).json({ message: "Invalid User" });
        }


        const purchase = await Purchase.findById(purchaseId);
        if (!purchase) {
            return res.status(404).json({ message: "Invalid Purchase" });
        }

        if (user != purchase.userID) {
            return res.status(404).json({ message: "Invalid Purchase" });
        }

        if(user.name!=name){
             return res.status(400).json({ message: "Bill owner name is not same as the user" });
        }

        if (expenseAmount > purchase.restAmount) {
            return res.status(400).json({ message: "Invalid amount" });
        }


        const isValid = isValidGST(GSTNumber);
        if (!isValid) {
            return res.status(400).json({ message: "Invalid gst number" });
        }


        purchase.restAmount -= expenseAmount;

        const restAmount = expenseAmount;
        const newExpense = new Expense({ name,title, expenseAmount, user, category, paymentMode, GSTNumber, BillNumber, purchaseId, restAmount });
        await newExpense.save();



        purchase.expensesList.push(newExpense._id);
        await purchase.save();

        return res.status(201).json({ message: "Expense added", expense: newExpense._id })
    }
    catch (err) {
        return res.status(500).json({ message: "Error creating expense", error: err.message });
    }

}

const editRequest=async(req,res) => {
    try{
        const { expenseId, title, expenseAmount, category, paymentMode, GSTNumber, BillNumber, purchaseId,reason }=req.body;

        const person = await User.findById(user);
        if (!person) {
            return res.status(404).json({ message: "Invalid User" });
        }


        const purchase = await Purchase.findById(purchaseId);
        if (!purchase) {
            return res.status(404).json({ message: "Invalid Purchase" });
        }

        if (req._id != purchase.userID) {
            return res.status(404).json({ message: "Invalid Purchase" });
        }
        
        const expense = await Expense.findById(expenseId);
        if (!expense) {
            return res.status(404).json({ message: "Invalid Expense" });
        }

        if (req._id != expense.user) {
            return res.status(404).json({ message: "Invalid acecess! the expense was not added by you" });
        }


        const newreq = new Request({ title, expenseAmount, user, category, paymentMode, GSTNumber, BillNumber, purchaseId,expenseId,reason });
        await newreq.save();

        return res.status(201).json({ message: "Edit request submitted" });

    }   
    catch (err) {
        return res.status(500).json({ message: "Error generating expense request", error: err.message });
    }
}

const reviewRequest=async(req,res)=>{
     try{
        const { requestId,status}=req.body;

        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Invalid Request" });
        }
        
        const purchase = await Purchase.findById(request.purchaseId);
        if (!purchase) {
            return res.status(404).json({ message: "Invalid Purchase" });
        }

        const sp = await splitPurchase.findById(purchase.splitPurchaseId);
        if (!sp) {
            return res.status(404).json({ message: "Invalid" });
        }
        
        if(sp.admin!=req._id){
             return res.status(400).json({ message: "Only admin can accept or deny the req" });
        }

        if(status=='Accepted'){
            const expense=await Expense.findById(request.expenseId);
            purchase.restAmount+=expense.expenseAmount;
            expense.title= request.title;
            expense.expenseAmount= request.expenseAmount;
            expense.user= request.user;
            expense.category=request.category;
            expense.paymentMode= request.paymentMode;
            expense.GSTNumber=request.GSTNumber;
            expense.BillNumber=request.BillNumber;
            expense.purchaseId=request.purchaseId;

        if (request.expenseAmount > purchase.restAmount) {
            return res.status(400).json({ message: "Invalid amount" });
        }


        const isValid = isValidGST(GSTNumber);
        if (!isValid) {
            return res.status(400).json({ message: "Invalid gst number" });
        }

        
        purchase.restAmount -= request.expenseAmount;
        await expense.save();

        }
        else{
            Request.findByIdAndDelete(requestId);
        }
        
     }
     catch (err) {
        return res.status(500).json({ message: "Error reviewing expense request", error: err.message });
    }

}

// const getRequests=async(req,res)=>{
     
// }


const addSplitPurchase = async (req, res) => {
    try {
        const { name, admin, amount, members } = req.body;
        if (!name || !admin || !amount || !members) {
            return res.status(400).json({ message: "All Fields are required" });
        }

        const restAmount = amount;
        const newsp = new splitPurchase({ name, admin, amount, members, restAmount });
        await newsp.save();

        return res.status(201).json({ message: "SplitPurchase added", splitPurchase: newsp._id })
    }
    catch (err) {
        return res.status(500).json({ message: "Error creating splitPurchase: ", error: err.message });
    }


}

const addPurchase = async (req, res) => {
    try {
        const { userID, amount, splitPurchaseId } = req.body;

        if (!userID || !amount || !splitPurchaseId) {
            return res.status(400).json({ message: "Please fill the required fields" });
        }

        const person = await User.findById(userID);
        if (!person) {
            return res.status(404).json({ message: "Invalid User" });
        }

        const sp = await splitPurchase.findById(splitPurchaseId);
        if (!sp) {
            return res.status(404).json({ message: "Invalid splitPurchase" });
        }

        if (req._id != sp.admin) {
            return res.status(404).json({ message: "Only admin is alowed to add a purchase" });
        }

        if (amount > sp.restAmount) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        sp.restAmount -= amount;

        const restAmount = amount;
        const newPurchase = new Purchase({ userID, amount, splitPurchaseId, restAmount });
        await newPurchase.save();

        sp.purchases.push(newPurchase._id);
        await sp.save();

        return res.status(201).json({ message: "Purchase added", Purchase: newPurchase._id })
    }
    catch (err) {
        return res.status(500).json({ message: "Error creating Purchase", error: err.message });
    }

}

module.exports = { addExpense, addSplitPurchase, addPurchase,editRequest,reviewRequest };