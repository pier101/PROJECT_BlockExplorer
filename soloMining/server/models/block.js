'use strict';
const Sequelize = require('sequelize');
module.exports = class Block extends Model {
  static init(sequelize){
    return super.init(
      {
        hash: { 
          type: Sequelize.STRING,
          allowNull : false,
        },
        version: {
          type : Sequelize.STRING,
          allowNull : false,
        },
        index: {
          type : Sequelize.INTEGER,
          allowNull : false,
          primaryKey: true
        },
        previousHash: {
          type : Sequelize.STRING,
          allowNull : false,
        },
        timestamp: { 
          type : Sequelize.INTEGER,
          allowNull : false,
        },
        merkleRoot: {
          type : Sequelize.STRING,
          allowNull : false,
        },
        difficulty: {
          type : Sequelize.INTEGER,
          allowNull : false,
        },
        nonce: {
          type : Sequelize.INTEGER,
          allowNull : false,
        },
        body: {
          type : Sequelize.STRING,
          allowNull : false,
        }
      }, 
      {
        sequelize,
        modelName: 'Block',
        timestamps: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      })
    }
    static associate(models) {}
}
