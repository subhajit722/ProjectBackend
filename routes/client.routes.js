const express = require("express");
const router = express.Router();
const {
  getClients,
  addClient,
  getClient,
  updateClient,
  deleteClient,
  getClientPag
} = require("../controllers/client.controller");
const { verifyToken, checkRole } = require("../middlewares/authMiddleware");

router.get("/",verifyToken, getClients);
router.get("/pag",verifyToken, getClientPag);
router.post("/", verifyToken, addClient);
router.get("/:id", verifyToken, getClient);
router.put("/:id", verifyToken, checkRole('admin',"manager"), updateClient);
router.delete("/:id", verifyToken,checkRole('admin',"manager"), deleteClient);

module.exports = router;
