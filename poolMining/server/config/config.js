const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  development: {
    username: "root",
    password: "1234",
    database: "dongdong_coin",
    port: "3307",
    host: "localhost",
    dialect: 'mysql',
  },
  test: {
    username: "root",
    password: "1234",
    database: "dongdong_coin",
    port: "3307",
    host: "localhost",
    dialect: 'mysql',
  },
  production: {
    username: "root",
    password: "1234",
    database: "dongdong_coin",
    port: "3307",
    host: "localhost",
    dialect: 'mysql',
  },
}