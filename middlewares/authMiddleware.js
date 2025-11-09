const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();


exports.verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; 

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user; 
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};


exports.checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Only ${allowedRoles.join(", ")} allowed.`,
      });
    }

    next();
  };
};

