'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Products', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            cat_id: {
                allowNull: true,
                type: Sequelize.INTEGER,
            },
            brand_id: {
                allowNull: true,
                type: Sequelize.INTEGER,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            type: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            stock: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            unit_of_product: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            expiry: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            price: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },

            discount: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },

            condition: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            sold: {
                allowNull: true,
                type: Sequelize.INTEGER,
            },

            status: {
                allowNull: false,

                type: Sequelize.BOOLEAN,
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
        await queryInterface.dropTable('Products');
    },
};
