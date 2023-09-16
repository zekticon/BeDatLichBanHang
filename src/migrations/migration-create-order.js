'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Orders', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            user_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            product_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            order_number: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            coupon: {
                allowNull: null,

                type: Sequelize.STRING,
            },
            sub_total: {
                allowNull: false,

                type: Sequelize.INTEGER,
            },
            quantity: {
                allowNull: false,

                type: Sequelize.STRING,
            },
            lastName: {
                allowNull: false,

                type: Sequelize.STRING,
            },
            firstName: {
                allowNull: false,

                type: Sequelize.STRING,
            },
            address: {
                allowNull: false,

                type: Sequelize.STRING,
            },
            phonenumber: {
                allowNull: false,

                type: Sequelize.STRING,
            },
            email: {
                allowNull: false,

                type: Sequelize.STRING,
            },
            note: {
                allowNull: false,

                type: Sequelize.STRING,
            },
            status: {
                allowNull: false,

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
        await queryInterface.dropTable('Orders');
    },
};
