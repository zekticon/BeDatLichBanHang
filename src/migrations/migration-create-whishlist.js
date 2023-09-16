'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('WhishLists', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            product_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            cat_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            price: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            quantity: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('WhishLists');
    },
};
