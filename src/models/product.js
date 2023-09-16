'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Product.hasOne(models.Markdown, { foreignKey: 'product_id' });

            Product.hasMany(models.Review, { foreignKey: 'product_id' });

            Product.hasMany(models.Image, { foreignKey: 'product_id' });

            Product.hasOne(models.ProductOrder, { foreignKey: 'product_id', as: 'imageData' });

            Product.belongsTo(models.Category, {
                foreignKey: 'cat_id',
            });
            Product.belongsTo(models.Brand, {
                foreignKey: 'brand_id',
            });
        }
    }
    Product.init(
        {
            cat_id: DataTypes.INTEGER,
            brand_id: DataTypes.INTEGER,
            title: DataTypes.STRING,
            type: DataTypes.STRING,
            stock: DataTypes.INTEGER,
            unit_of_product: DataTypes.STRING,
            expiry: DataTypes.STRING,
            price: DataTypes.INTEGER,
            discount: DataTypes.INTEGER,
            condition: DataTypes.STRING,
            sold: DataTypes.INTEGER,
            status: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: 'Product',
        },
    );
    return Product;
};
