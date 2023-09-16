'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ProductOrder extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            ProductOrder.belongsTo(models.Order, {
                foreignKey: 'order_id',
            });
            ProductOrder.belongsTo(models.Product, {
                foreignKey: 'product_id',
                as: 'imageData',
            });
        }
    }
    ProductOrder.init(
        {
            order_id: DataTypes.INTEGER,
            product_id: DataTypes.INTEGER,
            quantity: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'ProductOrder',
        },
    );
    return ProductOrder;
};
