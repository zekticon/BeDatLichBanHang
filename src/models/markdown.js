'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Markdown extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Markdown.belongsTo(models.Product, { foreignKey: 'product_id' });

            Markdown.belongsTo(models.User, { foreignKey: 'user_id' });
        }
    }
    Markdown.init(
        {
            user_id: DataTypes.INTEGER,
            product_id: DataTypes.INTEGER,
            descriptionHtml: DataTypes.STRING,
            specificationHtml: DataTypes.STRING,
            featureHtml: DataTypes.STRING,
            assignHtml: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Markdown',
        },
    );
    return Markdown;
};
