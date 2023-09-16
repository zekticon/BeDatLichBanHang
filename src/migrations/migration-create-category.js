'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Categories', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            title: {
                allowNull: false,

                type: Sequelize.STRING,
            },
            summary: {
                type: Sequelize.STRING,
                allowNull: true,
            },

            is_parent: {
                allowNull: true,

                type: Sequelize.STRING,
            },
            parent_id: {
                allowNull: false,

                type: Sequelize.BOOLEAN,
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
        await queryInterface.dropTable('Categories');
    },
};
