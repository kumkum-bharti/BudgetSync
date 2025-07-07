import User from './User';
import Purchase from './purchase'
import mongoose from 'mongoose';


const spSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:Purchase,
        required:true
    }]
    
});

module.exports=mongoose.model('splitPurchase',spSchema);