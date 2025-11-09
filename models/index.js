'use strict';

require('dotenv').config(); // ✅ Load .env first
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const db = {};

// ✅ Read database credentials from .env
const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
    Port : 4000,
       dialectOptions: {
        ssl: {
          
            ca: fs.readFileSync(process.env.CA)
        }
    },
    logging: false,
  }
);


fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      !file.includes('.test.js')
    );
  })
  .forEach(file => {
    const modelPath = path.join(__dirname, file);
    const modelDef = require(modelPath);
    if (typeof modelDef === 'function') {
      const model = modelDef(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
      console.log(`✅ Loaded model: ${model.name}`);
    }
  });


Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
