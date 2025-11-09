const express = require("express");
const router = express.Router();
const {
  getRevenue,
  addRevenue,
  getPartnerRevenue,
  updateRevenue,
  deleteRevenue
} = require("../controllers/revenue.controller");

const { verifyToken, checkRole } = require("../middlewares/authMiddleware");
router.get("/", verifyToken, getRevenue);
router.post("/", verifyToken, addRevenue);
router.get("/:id", verifyToken, getPartnerRevenue);
router.put("/:id",verifyToken, checkRole('admin',"manager"), updateRevenue); 
router.delete("/:id", verifyToken, checkRole('admin',"manager"), deleteRevenue); 

module.exports = router;
