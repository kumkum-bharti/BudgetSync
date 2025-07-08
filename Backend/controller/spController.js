const Expense = require('../models/Expenses');
const User = require('../models/User');
const splitPurchase = require('../models/sp');
const Purchase = require('../models/Purchases');


const addExpense = async (req, res) => {
    try {
        const { title, expenseAmount, user, category, paymentMode, GSTNumber, BillNumber, purchaseId } = req.body;

        if (!title || !expenseAmount || !user || !GSTNumber || !BillNumber || ! purchaseId) {
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

        if(user!=purchase.userID){
            return res.status(404).json({ message: "Invalid Purchase" });
        }

        if(expenseAmount>purchase.restAmount){
                 return res.status(400).json({ message: "Invalid amount" });
        }

        purchase.restAmount-=expenseAmount;

        const restAmount=expenseAmount;
        const newExpense = new Expense({ title, expenseAmount, user, category, paymentMode, GSTNumber, BillNumber,purchaseId,restAmount });
        await newExpense.save();
        

        
        purchase.expensesList.push(newExpense._id);
        await purchase.save();

        return res.status(201).json({ message: "Expense added", expense: newExpense._id })
    }
    catch (err) {
        return res.status(500).json({ message: "Error creating expense", error: err.message });
    }

}

const addSplitPurchase = async (req, res) => {
    try {
        const { name, admin, amount, members } = req.body;
        if (!name || !admin || !amount || !members) {
            return res.status(400).json({ message: "All Fields are required" });
        }
        
        const restAmount=amount;
        const newsp = new splitPurchase({ name,admin,amount,members,restAmount });
        await newsp.save();

        return res.status(201).json({ message: "SplitPurchase added", splitPurchase: newsp._id })
    }
    catch (err) {
        return res.status(500).json({ message: "Error creating splitPurchase: ", error: err.message });
    }


}

const addPurchase = async (req, res) => {
    try {
        const { userID, amount,splitPurchaseId } = req.body;

        if (!userID || !amount ||!splitPurchaseId) {
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
        
        if(amount>sp.restAmount){
              return res.status(400).json({ message: "Invalid amount" });
        }
        
        sp.restAmount-=amount;

        const restAmount=amount;
        const newPurchase = new Purchase({ userID, amount,splitPurchaseId,restAmount });
        await newPurchase.save();

        sp.purchases.push(newPurchase._id);
        await sp.save();

        return res.status(201).json({ message: "Purchase added", Purchase: newPurchase._id })
    }
    catch (err) {
        return res.status(500).json({ message: "Error creating Purchase", error: err.message });
    }

}

module.exports = { addExpense, addSplitPurchase, addPurchase };