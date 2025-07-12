const User = require('./User');
const Purchase = require('./Purchases');
const Expense = require('./Expenses');

const mongoose = require("mongoose");

const requestSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    expenseAmount: {
        type: Number
    },
    category: {
        type: String,
        enum: ['Food', 'Transport', 'Shopping', 'Utilities', 'Health', 'Education', 'Entertainment', 'Rent', 'Other'],
        default: 'Other',
    },
    paymentMode: {
        type: String,
        enum: ['Cash', 'Card', 'UPI', 'Bank Transfer', 'Other'],
        default: 'Other',
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Denied'],
        default: 'Pending'
    },
    reason: {
        type: String,
        required: true
    },
    GSTNumber: {
        type: String
    },

    BillNumber: {
        type: String
    },
    expenseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Expense,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);