'use strict';
const Sequelize = require('sequelize')
module.exports =  class Miner extends Sequelize.Model {

  static init(sequelize){
    return super.init(
      {
        miner_email: {
          type : Sequelize.INTEGER,
          allowNull : false,
          primaryKey: true,
        },
        miner_password: {
          type : Sequelize.INTEGER,
          allowNull : false,
        },
        miner_address: {
          type : Sequelize.STRING(100)
        },
        miner_publicKey: {
          type : Sequelize.STRING(100)
        },
      },
      {
        sequelize,
        modelName: 'Miner',
        timestamps: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      },  
    )
  }  
    static associate(db) {
    }
  };
