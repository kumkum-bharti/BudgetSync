const User=require('../models/User');
const bcrypt=require('bcrypt');
const {sendOtp,verifyOtp}=require('../utils/otps.js');


const beginRegister=async(req,res)=>{
    try{
        const { name,phone,email }=req.body;
        if(!name|| !phone || !email ){
            return res.status(400).json({message:"All fields are required."});
        }

        const user1=await User.findOne({email});
        if(user1)
            return res.status(400).json({message:"User already exists"});


        await sendOtp(email); 
        
        return res.status(201).json({message:"OTP sent successfully."});


    }catch(err){
        return res.status(500).json({message:"Error sending otp, verify your email",error:err.message });
    }
}

const register=async(req,res)=>{
    try{
        const {verifynum,password,name,phone,email}=req.body;

        const flag= await verifyOtp(email,verifynum);
        if(flag){
            const salt=await bcrypt.genSalt(10);
            const hashedPassword= await bcrypt.hash(password,salt);
            const newUser=new User({name,phone,email,password:hashedPassword})
            await newUser.save();
                return res.status(201).json({message:"User registered Successfully."});
        }
        else{
            console.log("Wrong otp");
        }
    }   
    catch(err){
        return res.status(500).json({message:"Error registering user",error:err.message });
    }
        
}


module.exports= {beginRegister,register};