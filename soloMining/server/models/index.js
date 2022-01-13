require("dotenv").config();

const Sequelize = require("sequelize");

const Blocks = require('./blocks');
const Node1 = require('./node1');
const Node2 = require('./node2');
const Node3 = require('./node3');

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

db.Blocks = Blocks;
db.Node1 = Node1;
db.Node2 = Node2;
db.Node3 = Node3;

Blocks.init(sequelize);
Node1.init(sequelize);
Node2.init(sequelize);
Node3.init(sequelize);

Blocks.associate(db);
Node1.associate(db);
Node2.associate(db);
Node3.associate(db);

module.exports = db;
