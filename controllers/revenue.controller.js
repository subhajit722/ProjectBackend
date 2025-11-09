const { Revenue, Client } = require("../models");
const { Op } = require("sequelize");


exports.getRevenue = async (req, res) => {
  try {
    const { page = 1, limit = 8, search = "" } = req.query;
    const offset = (page - 1) * limit;

    
    let where = {};
    let clientWhere = {};

    if (search) {
      if (!isNaN(search)) {
        
        where = { id: parseInt(search) };
      } else {
        
        clientWhere = {
          name: { [Op.like]: `%${search}%` },
        };
      }
    }

    
    const { rows, count } = await Revenue.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["id", "DESC"]],
      include: [
        {
          model: Client,
          attributes: ["id", "name", "email"],
          where: clientWhere, // ✅ Apply client name filter
        },
      ],
    });

    res.json({
      data: rows,
      total: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


exports.addRevenue = async (req, res) => {
  try {
    const newRevenue = await Revenue.create(req.body);
    res.json({ message: "Revenue added successfully", data: newRevenue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


exports.getPartnerRevenue = async (req, res) => {
  try {
    const data = await Revenue.findAll({
      where: { partner_id: req.params.id },
      order: [["id", "DESC"]],
      include: [
        {
          model: Client,
          attributes: ["id", "name", "email"],
        },
      ],
    });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateRevenue = async (req, res) => {
  try {
    const id = req.params.id;
    const revenue = await Revenue.findByPk(id);

    if (!revenue) {
      return res.status(404).json({ message: "Revenue not found" });
    }

    await revenue.update(req.body);
    res.json({ message: "Revenue updated successfully", data: revenue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


exports.deleteRevenue = async (req, res) => {
  try {
    const id = req.params.id;
    const revenue = await Revenue.findByPk(id);

    if (!revenue) {
      return res.status(404).json({ message: "Revenue not found" });
    }

    await revenue.destroy();
    res.json({ message: "Revenue deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
