require("dotenv").config();

const Sequelize = require("sequelize");
const Miner = require("./miner");
const Blocks = require('./blocks');

const env = process.env.NODE_ENV || "development";
const db = {};

const config = require("../config/config.js")[env]
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,  
  config,
  // {host: config.host,
  // dialect: "mysql",}

);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Miner = Miner;
db.Blocks = Blocks;

Miner.init(sequelize);
Blocks.init(sequelize);

Miner.associate(db);
Blocks.associate(db);
module.exports = db;
