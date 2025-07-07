const mongoose=require ('mongoose');
import User from './User'
import Expense  from './expenses'


const purchaseSchema=mongoose.Schema({
      userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true
      },
      amount:{
        type:Number,
        required:true
      },
      expensesList:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:Expense,
        required:true
      }],
      
      verified:{
        type:boolean,
        default:false
      }
});


module.exports=mongoose.model('Purchase',purchaseSchema);