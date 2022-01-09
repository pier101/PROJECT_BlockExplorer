require("dotenv").config();

const Sequelize = require("sequelize");
const Miner = require("./miner");

const env = process.env.NODE_ENV || "development";
const db = {};

const config = require("../config/config.js")[env]
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {host: config.host,
  dialect: "mysql",}
  // process.env.MYSQL_USERNAME,
  // process.env.MYSQL_PASSWORD,
  // process.env.MYSQL_DATABASE,
  // process.env.MYSQL_PORT,

  // {
  //   host: process.env.MYSQL_HOST,
  //   dialect: "mysql",
  //   timezone: "+09:00", // DB에 저장할 때 시간 설정
  //   dialectOptions: {
  //     timezone: "+09:00", // DB에서 가져올 때 시간 설정
  //   },
  //   define: {
  //     timestamps: false,
  //     supportBigNumbers: true,
  //   },
  // },
);

db.sequelize = sequelize;
// db.Sequelize = Sequelize;

db.Miner = Miner;

Miner.init(sequelize);
Miner.associate(db);

module.exports = db;
