const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();
const { Op } = require("sequelize");


exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, role });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.update({ name, email, role });
    res.json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err.message });
  }
};


exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const offset = (page - 1) * limit;
    const search = req.query.search ? req.query.search.trim() : "";

    const where = search
      ? { name: { [Op.like]: `%${search}%` } }
      : {};

    const { count, rows } = await User.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      data: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalClients: count,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to fetch User" });
  }
};


exports.getUserBYID = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
     
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to fetch user details" });
  }
};