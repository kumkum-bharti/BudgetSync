const User=require('../models/User');
const jwt=require('jsonwebtoken');

const isLoggedIn=async(req,res,next)=>{
    try{
       const authHeader=req.headers.authorization;
       
       if(!authHeader || !authHeader.startsWith('Bearer')){
         return res.status(401).json({message:"Token Missing"});
       }

       const token=authHeader.split(' ')[1];
       
       const decoded=jwt.verify(token,process.env.secret);
       req._id = decoded.id;

       const user=await User.findById(decoded.id);

       if(!user || user.token!=token){
          return res.status(401).json({ message: "Invalid or expired token." });
       }
       
       req.user=user;
       next();
    }
    catch (error) {
        console.error("Error in isloggedIn middleware:", error);
        return res.status(401).json({ message: "Unauthorized access." });
    }
}


module.exports=isLoggedIn;