const { Client, Revenue } = require("../models");
const { Sequelize } = require("sequelize");

exports.getSummary = async (req, res) => {
  const totalClients = await Client.count();
  const totalCredit = await Revenue.sum("credit");
  const totalDebit = await Revenue.sum("debit");
  const balance = (totalCredit || 0) - (totalDebit || 0);

  res.json({
    totalClients,
    totalCredit,
    totalDebit,
    balance,
  });
};
