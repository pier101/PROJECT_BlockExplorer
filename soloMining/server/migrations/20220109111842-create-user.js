'use strict';
// const Sequelize = require('sequelize')
// const {Model}  = DataTypes
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Miner', {
      miner_email: {
        type: Sequelize.INTEGER,
        allowNull : false,
        primaryKey: true,
      },
      miner_password: {
        type: Sequelize.INTEGER,
        allowNull : false,
      },
      miner_address: {
        type : Sequelize.STRING(100)
      },
      miner_publicKey: {
        type : Sequelize.STRING(100)
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Miner');
  }
};