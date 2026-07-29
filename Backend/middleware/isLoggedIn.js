const User = require('../models/User');
const jwt = require('jsonwebtoken');

const isLoggedIn = async (req, res, next) => {
  try {
    console.log("--- AUTH CHECK START ---");
    console.log("Headers received:", req.headers);

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    console.log("Extracted token:", token);

    if (!token) {
      console.log("FAIL: No token found in headers or cookies");
      return res.status(401).json({ message: "Token not provided." });
    }

    const decoded = jwt.verify(token, process.env.secret);
    console.log("Token decoded successfully for user ID:", decoded.id);

    req._id = decoded.id;
    next();
  } catch (error) {
    console.error("FAIL: Error verifying token in isLoggedIn:", error.message);
    return res.status(401).json({ message: "Unauthorized access." });
  }
};

module.exports = isLoggedIn;