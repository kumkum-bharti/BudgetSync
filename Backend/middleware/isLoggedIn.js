const User=require('../models/User');
const jwt=require('jsonwebtoken');

const isLoggedIn=async(req,res,next)=>{
    try{
       const token = req.cookies.token;
       
       const decoded=jwt.verify(token,process.env.secret);
       req._id = decoded.id;

       const user=await User.findById(decoded.id);

       if(!token){
          return res.status(401).json({ message: "Invalid or expired token." });
       }

       console.log("Cookies:", req.cookies);

       
       req.user=user;
       next();
    }
    catch (error) {
        console.error("Error in isloggedIn middleware:", error);
        return res.status(401).json({ message: "Unauthorized access." });
    }
}


module.exports=isLoggedIn;