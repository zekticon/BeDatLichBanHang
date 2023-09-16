'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Images', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },

            user_id: {
                allowNull: true,

                type: Sequelize.INTEGER,
            },
            banner_id: {
                allowNull: true,

                type: Sequelize.INTEGER,
            },
            product_id: {
                allowNull: true,

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
            photo: {
                type: Sequelize.BLOB('long'),
                allowNull: true,
            },
            rememberToken: {
                type: Sequelize.STRING,
                allowNull: true,
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
        await queryInterface.dropTable('Images');
    },
};
