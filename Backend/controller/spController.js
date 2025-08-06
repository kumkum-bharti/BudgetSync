const Expense = require('../models/Expenses');
const User = require('../models/User');
const splitPurchase = require('../models/sp');
const Purchase = require('../models/Purchase');
const Request = require('../models/request');
const mongoose = require("mongoose");

function isValidGST(gstin) {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gstin);
}

const addExpense = async (req, res) => {
    try {
        const { name, title, expenseAmount, category, paymentMode, GSTNumber, BillNumber, purchaseId } = req.body;

        const user = req._id;


        if (!name || !title || !expenseAmount || !user || !GSTNumber || !BillNumber || !purchaseId) {
            return res.status(400).json({ message: "Please fill the required fields" });
        }


        const person = await User.findById(user);
        if (!person) {
            return res.status(404).json({ message: "Invalid User" });
        }


        console.log("purchaseId received:", purchaseId);
        console.log("Length:", purchaseId.length);
        // console.log("IsValidHex24:", /^[a-fA-F0-9]{24}$/.test(purchaseId));

        // const cleanedId = purchaseId.trim().slice(0, 24);
        // console.log("Length:", cleanedId.length);




        // if (!mongoose.Types.ObjectId.isValid(cleanedId)) {
        //     return res.status(400).json({ message: "Invalid ObjectId format" });
        // }

        const purchase = await Purchase.findById(purchaseId);
        if (!purchase) {
            return res.status(404).json({ message: "Invalid Purchase" });
        }


        if (user != purchase.userID) {
            return res.status(404).json({ message: "Invalid Purchase" });
        }

        if (String(user) !== String(purchase.userID)) {
            return res.status(403).json({ message: "Unauthorized: Purchase doesn't belong to user" });
        }

        console.log("vgv");

        if (person.name.toLowerCase() != name.toLowerCase()) {
            return res.status(400).json({ message: "Bill owner name is not same as the user" });
        }

        if (expenseAmount > purchase.restAmount) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        console.log(GSTNumber);
        const isValid = isValidGST(GSTNumber);
        if (!isValid) {
            return res.status(400).json({ message: "Invalid gst number" });
        }




        purchase.restAmount -= expenseAmount;

        const restAmount = expenseAmount;
        const newExpense = new Expense({ name, title, expenseAmount, user, category, paymentMode, GSTNumber, BillNumber, purchaseId, restAmount });
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
        const { name, amount, members } = req.body;
        const admin = req._id;
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

        await sp.purchases.push(newPurchase._id);
        await sp.save();

        return res.status(201).json({ message: "Purchase added", Purchase: newPurchase })
    }
    catch (err) {
        return res.status(500).json({ message: "Error creating Purchase", error: err.message });
    }

}

const editRequest = async (req, res) => {
    try {
        const { name, expenseId, title, expenseAmount, category, paymentMode, GSTNumber, BillNumber, reason } = req.body;

        const user = req._id;

        const person = await User.findById(user);
        if (!person) {
            return res.status(404).json({ message: "Invalid User" });
        }

        const expense = await Expense.findById(expenseId);
        if (!expense) {
            return res.status(404).json({ message: "Invalid Expense" });
        }


        const purchase = await Purchase.findById(expense.purchaseId);

        if (!purchase) {
            return res.status(404).json({ message: "Invalid Purchase" });
        }

        if (req._id != purchase.userID) {
            return res.status(40).json({ message: "Invlaid acces for editing request" });
        }



        if (req._id != expense.user) {
            return res.status(404).json({ message: "Invalid acecess! the expense was not added by you" });
        }


        const newreq = new Request({ name, title, expenseAmount, user, category, paymentMode, GSTNumber, BillNumber, expenseId, reason });
        await newreq.save();

        return res.status(201).json({ message: "Edit request submitted" });

    }
    catch (err) {
        return res.status(500).json({ message: "Error generating expense request", error: err.message });
    }
}

const reviewRequest = async (req, res) => {
    try {
        const { requestId, status } = req.body;


        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Invalid Request" });
        }

        const oldExpense = await Expense.findById(request.expenseId);
        if (!oldExpense) {
            return res.status(404).json({ message: "Invalid expense" });
        }

        const oldPurchaseId = oldExpense.purchaseId;

        const purchase = await Purchase.findById(oldPurchaseId);
        if (!purchase) {
            return res.status(404).json({ message: "Invalid Purchase" });
        }

        const sp = await splitPurchase.findById(purchase.splitPurchaseId);
        if (!sp) {
            return res.status(404).json({ message: "Invalid" });
        }


        if (sp.admin != req._id) {
            return res.status(400).json({ message: "Only admin can accept or deny the req" });
        }


        if (status == 'Accepted') {
            if (oldExpense) {
                purchase.restAmount += oldExpense.expenseAmount;
                await purchase.save();
            }

            const { name, title, expenseAmount, user, category, paymentMode, GSTNumber, BillNumber } = request;


            if (!name || !title || !expenseAmount || !user || !GSTNumber || !BillNumber || !oldPurchaseId) {
                return res.status(400).json({ message: "Please fill the required fields" });
            }


            const person = await User.findById(user);
            if (!person) {
                return res.status(404).json({ message: "Invalid User" });
            }


            if (user.toString() != purchase.userID.toString()) {
                return res.status(404).json({ message: "Invalid as user and purchase user is not same" });
            }

            if (person.name.toLowerCase() != name.toLowerCase()) {
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
            await purchase.save();

            const newExpense = new Expense({ name, title, expenseAmount, user, category, paymentMode, GSTNumber, BillNumber, purchaseId: oldPurchaseId, restAmount });
            await newExpense.save();



            purchase.expensesList.push(newExpense._id);
            await purchase.save();

            purchase.expenseList.pull(request.expenseId);
            await oldExpense.deleteOne();
            await request.deleteOne();

            return res.status(500).json({ message: "Request accepted and edited expense is added." });
        }

        if (status == 'Denied') {
            await request.deleteOne();
            return res.status(500).json({ message: "Request denied ", error: err.message });
        }
    }
    catch (err) {
        return res.status(500).json({ message: "Error reviewing expense request", error: err.message });
    }

}

const getRequests = async (req, res) => {
    try {
        const { spId } = req.body;
        const admin = req._id;

        console.log(req._id);

        sp = await splitPurchase.findById(spId);




        if (!(sp.admin.equals(admin))) {
            return res.status(400).json({ message: "Invalid Access" });
        }

        const purchases = await Purchase.find({ splitPurchaseId: spId }).select('_id');

        const purchaseIds = purchases.map(p => p._id);

        const expenses = await Expense.find({ purchaseId: { $in: purchaseIds } }).select('_id');

        const expenseIds = expenses.map(e => e._id);

        const requests = await Request.find({ expenseId: { $in: expenseIds } })
            // .populate('user', 'name email')
            // .populate('expenseId')
            .sort({ createdAt: -1 });

        return res.status(200).json({ requests });
    } catch (err) {
        return res.status(500).json({ message: "Error fetching requests", error: err.message });
    }

}

const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req._id }).sort({ createdAt: -1 });

        if (expenses.length === 0) {
            return res.status(400).json({ message: "No expenses added yet." });
        }


        return res.status(200).json({ expenses });
    }
    catch (err) {
        return res.status(500).json({ message: "Error fetching expenses", error: err.message });
    }

}

const getPurchases = async (req, res) => {
    try {
        const { spId } = req.query;

        const sp = await splitPurchase.findById(spId).populate({
            path: "purchases",
            populate: {
                path: "userID",
                model: "User"
            }
        });//this is how nested populating is done.

        const purchaseList = sp.purchases;


        if (purchaseList.length === 0) {
            return res.status(400).json({ message: "No purchases added yet." });
        }


        return res.status(200).json(purchaseList);
    }
    catch (err) {
        return res.status(500).json({ message: "Error fetching Purchases", error: err.message });
    }

}

const getSp = async (req, res) => {
    try {
        const spAdmin = await splitPurchase.find({ admin: req._id }).populate("admin").populate("members").sort({ createdAt: -1 });
        const spMember = await splitPurchase.find({ members: { $in: [req._id] } }).populate("admin").populate("members").sort({ createdAt: -1 });

        if (spAdmin.length === 0 && spMember.length === 0) {
            return res.status(400).json({ message: "You have not any splitPurchase group" });
        }

        const adminIds = spAdmin.map(sp => sp._id.toString());

        const filteredMember = spMember.filter(member => !adminIds.includes(member._id.toString()));

        return res.status(200).json({ spAdmin: spAdmin, SPmember: filteredMember });
    }
    catch (err) {
        return res.status(500).json({ message: "Error fetching expenses", error: err.message });
    }

}

const editSp = async (req, res) => {
    try {
        const { spId, newName } = req.body;

        const sp = await splitPurchase.findById(spId);

        if (!(sp.admin.equals(req._id))) {
            return res.status(400).json({ message: "Only Admin can edit splitPurchase group." });
        }

        sp.name = newName;
        await sp.save();

        return res.status(200).json({ message: "Name of the group is updated." });
    } catch (err) {
        return res.status(500).json({ message: "Error in editing", error: err.message });
    }


}

const deletePurchase = async (req, res) => {
    try {
        const { purchaseId } = req.body;

        const purchase = await Purchase.findById(purchaseId);

        if (!purchase) {
            return res.status(404).json({ message: "Purchase doesn't exist." });
        }


        const sp = await splitPurchase.findById(purchase.splitPurchaseId);

        if (!(sp.admin.equals(req._id))) {
            return res.status(400).json({ message: "Only Admin can edit splitPurchase group." });
        }

        await Expense.deleteMany({ _id: { $in: purchase.expenseList } });

        sp.restAmount += purchase.restAmount;

        await Purchase.findByIdAndDelete(purchaseId);

        sp.purchases.pull(purchaseId);
        sp.members.pull(purchase.userID);

        await sp.save();

        return res.status(200).json({ message: "Purchase is deleted." });
    } catch (err) {
        return res.status(500).json({ message: "Error in deleting purchase", error: err.message });
    }


}


const deleteSp = async (req, res) => {
    try {
        const { spId } = req.body;

        const sp = await splitPurchase.findById(spId);

        if (!sp) return res.status(404).json({ message: "Split Purchase group not found" });


        if (!(sp.admin.equals(req._id))) {
            return res.status(400).json({ message: "Only Admin can edit splitPurchase group." });
        }

        for (const purchaseId of sp.purchases) {
            const purchase = await Purchase.findById(purchaseId);

            if (purchase) {
                await Expense.deleteMany({ _id: { $in: purchase.expenseList } });

                await Purchase.deleteOne(purchase);
            }
        }

        await splitPurchase.findByIdAndDelete(spId);

        return res.status(200).json({ message: "SplitPurchase is deleted." });
    }
    catch (err) {
        return res.status(500).json({ message: "Error in deleting SplitPurchase", error: err.message });
    }


}


module.exports = { addExpense, addSplitPurchase, addPurchase, editRequest, reviewRequest, getRequests, getExpenses, getPurchases, getSp, editSp, deletePurchase, deleteSp };