const Sequelize = require("sequelize");

module.exports = class Blocks extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                hash: {
                    type: Sequelize.STRING(64),
                    allowNull: false,
                },
                version: {
                    type: Sequelize.STRING(10),
                    allowNull: false,
                },
                index: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    unique:true
                },
                previousHash: {
                    type: Sequelize.STRING(64),
                    allowNull: false,
                },
                timestamp: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                merkleRoot: {
                    type: Sequelize.STRING(64),
                    allowNull: false,
                },
                difficulty: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                nonce: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                body: {
                    type: Sequelize.STRING(255),
                    allowNull: false,
                    defaultValue : "TX-1"
                },
                miner: {
                    type: Sequelize.STRING(130),
                    allowNull:true
                }
            },
            {
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: "Blocks",
                tableName: "blocks",
                paranoid: false,
                charset: "utf8mb4",
                collate: "utf8mb4_general_ci",
            }
        );
    }

    static associate(db) {
    }
};