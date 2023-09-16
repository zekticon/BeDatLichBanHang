'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class WhishList extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    WhishList.init(
        {
            product_id: DataTypes.INTEGER,
            cat_id: DataTypes.INTEGER,
            price: DataTypes.INTEGER,
            quantity: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'WhishList',
        },
    );
    return WhishList;
};
