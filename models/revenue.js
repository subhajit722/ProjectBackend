'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Revenue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Revenue.belongsTo(models.Client, { foreignKey: "partner_id",
        onDelete: "CASCADE",
        hooks: true
       });
    }
  }
  Revenue.init({
    partner_id: DataTypes.INTEGER,
    date: DataTypes.DATE,
    document: DataTypes.STRING,
    credit: DataTypes.FLOAT,
    debit: DataTypes.FLOAT,
    balance: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Revenue',
  });
  return Revenue;
};