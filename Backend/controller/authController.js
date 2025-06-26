const User=require('../models/User');
const bcrypt=require('bcrypt');
const{sendOtp}=require('../utils/otps.js');


const register=async(req,res)=>{
    try{
        const { name,phone,email,password }=req.body;
        if(!name|| !phone || !email || !password){
            return res.status(400).json({message:"All fields are required."});
        }

        const user1=await User.findOne({email});
        if(user1)
            return res.status(400).json({message:"User already exists"});

        
        await sendOtp(email); 
        const salt=await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(password,salt);
       

        const newUser=new User({name,phone,email,password:hashedPassword})
        await newUser.save();
        
        return res.status(201).json({message:"User registered successfully."});


    }catch(err){
        return res.status(500).json({message:"Error registering user",err});
    }
}



module.exports=register;