'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Client, { foreignKey: "user_id" });
    }
  }

  User.init(
    {
      name: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      role: {
        type: DataTypes.ENUM("admin", "manager", "employee"), // 👈 new field
        allowNull: false,
        defaultValue: "employee",
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  return User;
};
