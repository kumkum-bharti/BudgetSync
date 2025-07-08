const mongoose = require('mongoose');
const User =require ('./User.js');
const Expense =require  ('./Expenses.js');
const splitPurchase=require  ('./sp.js');

const purchaseSchema = mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  restAmount: {
    type: Number
  },
  expensesList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: Expense,
    default:[]
  }],

  splitPurchaseId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: splitPurchase ,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  }
});


module.exports = mongoose.model('Purchase', purchaseSchema);