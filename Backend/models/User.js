const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: string,
        required: true
    },
    phone: {
        type: string,
        required: true
    },
    role: {
        type: string,
        required: true
    }
},
    { timestamps: true }

)

module.exports = mongoose.model('User', userSchema);