const mongoose = require('mongoose');

const spSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    restAmount: {
        type: Number
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    purchases: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Purchase",
        default: []
    }],

});

module.exports = mongoose.model("splitPurchase", spSchema);