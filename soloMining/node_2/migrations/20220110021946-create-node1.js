
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Blocks', {
      hash: {
        type: Sequelize.STRING(64),
        allowNull : false,
      },
      version: {
        type: Sequelize.STRING(10),
        allowNull : false,
      },
      index: {
        type: Sequelize.INTEGER,
        allowNull : false,
        primaryKey: true,
      },
      previousHash: {
        type: Sequelize.STRING(64),
        allowNull : false,
      },
      timestamp: {
        type: Sequelize.INTEGER,
        allowNull : false,
      },
      merkleRoot: {
        type: Sequelize.STRING(64),
        allowNull : false,
      },
      difficulty: {
        type: Sequelize.INTEGER,
        allowNull : false,
      },
      nonce: {
        type: Sequelize.INTEGER,
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