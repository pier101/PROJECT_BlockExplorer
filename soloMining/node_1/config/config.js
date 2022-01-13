const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  development: {
    username: "root",
    password: "1234",
    database: "node_1",
    port : 3307,
    host: "localhost",
    dialect: 'mysql',
  },
  test: {
    username: "root",
    password: "1234",
    database: "6002_node",
    host: "localhost",
    dialect: 'mysql',
  },
  production: {
    username: "root",
    password: "1234",
    database: "6002_node",
    host: "localhost",
    dialect: 'mysql',
  },
}