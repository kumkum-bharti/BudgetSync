const otp=require('../models/Otp');
const randomstring= require('randomstring');
const sendEmail=require('./sendEmails');

const generateOtp=()=>{
    return randomstring.generate({
        length: 6,
        charset: 'numeric'
    });
}

const sendOtp=async(email)=>{
   
     const otpnum=generateOtp();
     const newotp=new otp({email,otpnum});
     await newotp.save();

     await sendEmail({
            to: email,
            subject: 'Your OTP',
            message: `<p>Your OTP is: <strong>${otpnum}</strong></p>`,
     })

            console.log('OTP sent successfully');
}

const verifyOtp=async(email,verifynum)=>{
        const checkotp=await otp.findOne({email});
        
        if (!checkotp) {
            console.log("OTP not found");
            return false;
        }

        
        const now = Date.now();
        const otpCreatedAt = new Date(checkotp.createdAt).getTime();

        if (now - otpCreatedAt > 5 * 60 * 1000) {
            console.log("OTP expired");
            await otp.deleteOne({ email }); 
            return false;
        }

        if(verifynum===checkotp.otpnum){
             console.log("correct otp")
             return true;
        }
        else{
            console.log("wrong otp")
            return false;
        }
}

module.exports={sendOtp,verifyOtp};