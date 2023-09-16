'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Review extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Review.belongsTo(models.Product, {
                foreignKey: 'product_id',
            });
            Review.belongsTo(models.User, {
                foreignKey: 'user_id',
            });
        }
    }
    Review.init(
        {
            user_id: DataTypes.INTEGER,
            product_id: DataTypes.INTEGER,
            doctor_id: DataTypes.INTEGER,
            rate: DataTypes.INTEGER,
            title: DataTypes.STRING,
            description: DataTypes.STRING,
            status: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: 'Review',
        },
    );
    return Review;
};
