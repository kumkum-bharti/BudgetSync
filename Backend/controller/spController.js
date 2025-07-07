const Expense =require ( '../models/expenses');
const User = require ('../models/User');


const addExpense=async(req,res)=>{
    try{
    const {title,expenseAmount,user,category,paymentMode,GSTNumber,BillNumber}=req.body;

    if(!title || !expenseAmount || !user || !GSTNumber || !BillNumber ){
        return res.status(500).json({message:"Please fill the required fields"});
    }
    
    const person=await User.findById(user);
     if(!person){
         return res.status(500).json({message:"Invalid User"});
     }

     const newExpense=new Expense({title,expenseAmount,user,category,paymentMode,GSTNumber,BillNumber});
     await newExpense.save();

     return res.status(201).json({message:"Expense added",expense:newExpense})
    }
    catch(err){
        return res.status(500).json({message:"Error creating expense",error:err.message});
    }

}

module.exports=addExpense;