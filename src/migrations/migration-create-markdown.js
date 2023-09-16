'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Markdowns', {
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
            product_id: {
                allowNull: true,

                type: Sequelize.INTEGER,
            },
            descriptionHtml: {
                allowNull: true,

                type: Sequelize.STRING,
            },

            specificationHtml: {
                type: Sequelize.STRING,
                allowNull: true,
            },

            featureHtml: {
                type: Sequelize.STRING,
                allowNull: true,
            },

            assignHtml: {
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
        await queryInterface.dropTable('Markdowns');
    },
};
