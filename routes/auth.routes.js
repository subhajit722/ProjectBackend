const express = require("express");
const router = express.Router();
const { register, login, updateUser, deleteUser,getUsers,getUserBYID } = require("../controllers/auth.controller");
const { verifyToken, checkRole } = require("../middlewares/authMiddleware");

router.post("/register", verifyToken, checkRole('admin'), register);
router.post("/login", login);
router.get('/:id',verifyToken,getUserBYID)
router.get('/',verifyToken,getUsers)
router.put("/update/:id", verifyToken, checkRole("admin"), updateUser);
router.delete("/delete/:id", verifyToken, checkRole("admin"), deleteUser);


module.exports = router;
