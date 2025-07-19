const mongoose = require("mongoose");

const expenseSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    expenseAmount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ['Food', 'Transport', 'Shopping', 'Utilities', 'Health', 'Education', 'Entertainment', 'Rent', 'Other'],
        default: 'Other',
    },
    paymentMode: {
        type: String,
        enum: ['Cash', 'Card', 'UPI', 'Bank Transfer', 'Other'],
        default: 'Cash',
    },
    GSTNumber: {
        type: String,
        required: true
    },

    BillNumber: {
        type: String,
        required: true
    },
    purchaseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Purchase",
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Expense", expenseSchema);