const otp=require('../models/Otp');
const randomstring= require('randomstring');
const sendEmail=require('./sendEmails');

const generateOtp=()=>{
    return randomstring.generate({
        length: 6,
        charset: 'numeric'
    });
}

const sendOtp=async()=>{
    console.log("sending otp");
    try{
     const {email}=req.body;
     const otp=generateOtp();
     const newotp=new otp({email,otp});
     await newotp.save();

     await sendEmail({
            to: email,
            subject: 'Your OTP',
            message: `<p>Your OTP is: <strong>${otp}</strong></p>`,
     })

     res.status(200).json({ success: true, message: 'OTP sent successfully'})
    }
    catch(error){
         console.error('Error sending OTP:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}
module.exports=sendOtp;