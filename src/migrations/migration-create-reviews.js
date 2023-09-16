'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Reviews', {
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
            doctor_id: {
                allowNull: true,

                type: Sequelize.INTEGER,
            },
            product_id: {
                allowNull: true,

                type: Sequelize.INTEGER,
            },
            rate: {
                allowNull: false,

                type: Sequelize.INTEGER,
            },

            title: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            description: {
                type: Sequelize.STRING,
                allowNull: true,
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
        await queryInterface.dropTable('Reviews');
    },
};
