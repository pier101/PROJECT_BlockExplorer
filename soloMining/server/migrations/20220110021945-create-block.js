'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Blocks', {
      hash: {
        type: Sequelize.STRING(70),
        allowNull : false,
      },
      version: {
        type: Sequelize.STRING(10),
        allowNull : false,
      },
      index: {
        type: Sequelize.INTEGER,
        allowNull : false,
      },
      previousHash: {
        type: Sequelize.STRING(70),
        allowNull : false,
      },
      timestamp: {
        type: Sequelize.INTEGER(20),
        allowNull : false,
      },
      merkleRoot: {
        type: Sequelize.STRING(70),
        allowNull : false,
      },
      difficulty: {
        type: Sequelize.INTEGER,
        allowNull : false,
      },
      nonce: {
        type: Sequelize.INTEGER(20),
        allowNull : false,
      },
      body: {
        type: Sequelize.STRING,
        allowNull : false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Blocks');
  }
};