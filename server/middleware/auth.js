const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const isAuthencated = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized token" });
    }

    const decodedData = await jwt.verify(token, process.env.SECRET_KEY);

    req.user = await User.findById(decodedData.id);
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const authorizedRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role:${req.user.role} is not allowed to access this resource`,
      });
    }
    next();
  };
};

module.exports = { authorizedRole, isAuthencated };
