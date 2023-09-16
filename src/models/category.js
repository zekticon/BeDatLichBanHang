'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Category.hasMany(models.Product, {
                foreignKey: 'cat_id',
            });
            Category.hasOne(models.Image, {
                foreignKey: 'cat_id',
            });
        }
    }
    Category.init(
        {
            title: DataTypes.STRING,
            summary: DataTypes.STRING,

            is_parent: DataTypes.BOOLEAN,
            parent_id: DataTypes.STRING,
            status: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: 'Category',
        },
    );
    return Category;
};
