const { Client, Revenue } = require("../models");
const { Op } = require("sequelize");


exports.getClients = async (req, res) => {
  try {
    const { search = "" } = req.query;
    const where = search
      ? { name: { [Op.like]: `%${search}%` } }
      : {};

    const clients = await Client.findAll({
      where,
      include: [{ model: Revenue }],
      order: [["id", "DESC"]],
    });

    res.json(clients);
  } catch (err) {
    console.error("Error in getClients:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.getClientPag = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const offset = (page - 1) * limit;
    const search = req.query.search ? req.query.search.trim() : "";

    const where = search
      ? { name: { [Op.like]: `%${search}%` } }
      : {};

    const { count, rows } = await Client.findAndCountAll({
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
    console.error("Error in getClientPag:", err);
    res.status(500).json({ error: "Failed to fetch clients" });
  }
};

exports.addClient = async (req, res) => {
  try {
    const data = await Client.create(req.body);
    res.json(data);
  } catch (err) {
    console.error("Error in addClient:", err);
    res.status(500).json({ error: "Failed to add client" });
  }
};


exports.getClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id, {
      include: [{ model: Revenue }],
    });

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.json(client);
  } catch (err) {
    console.error("Error in getClient:", err);
    res.status(500).json({ error: "Failed to fetch client details" });
  }
};


exports.updateClient = async (req, res) => {
  try {
    const [updated] = await Client.update(req.body, {
      where: { id: req.params.id },
    });

    if (!updated) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.json({ message: "Client updated successfully" });
  } catch (err) {
    console.error("Error in updateClient:", err);
    res.status(500).json({ error: "Failed to update client" });
  }
};


exports.deleteClient = async (req, res) => {
  try {
    const clientId = req.params.id;

    
    await Revenue.destroy({ where: { partner_id: clientId } });

    
    const deleted = await Client.destroy({ where: { id: clientId } });

    if (!deleted) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.json({ message: "Client and related revenues deleted successfully" });
  } catch (err) {
    console.error("Error in deleteClient:", err);
    res.status(500).json({ error: "Failed to delete client" });
  }
};
