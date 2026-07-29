const User = require('../models/User');
const jwt = require('jsonwebtoken');

const isLoggedIn = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Token not provided." });
    }

    const decoded = jwt.verify(token, process.env.secret);
    req._id = decoded.id;

    next();
  } catch (error) {
    console.error("Error in isLoggedIn middleware:", error);
    return res.status(401).json({ message: "Unauthorized access." });
  }
};

module.exports = isLoggedIn;