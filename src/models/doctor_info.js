'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Doctor_info extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Doctor_info.belongsTo(models.User, { foreignKey: 'doctorId' });

            Doctor_info.belongsTo(models.Allcode, {
                foreignKey: 'priceId',
                targetKey: 'key',
                as: 'priceTypeData',
            });
            Doctor_info.belongsTo(models.Allcode, {
                foreignKey: 'provinceId',
                targetKey: 'key',
                as: 'provinceTypeData',
            });
            Doctor_info.belongsTo(models.Allcode, {
                foreignKey: 'paymentId',
                targetKey: 'key',
                as: 'paymentTypeData',
            });

            Doctor_info.belongsTo(models.User, { foreignKey: 'doctorId' });
        }
    }
    Doctor_info.init(
        {
            doctorId: DataTypes.INTEGER,

            priceId: DataTypes.STRING,
            provinceId: DataTypes.STRING,
            paymentId: DataTypes.STRING,
            addressClinic: DataTypes.STRING,
            nameClinic: DataTypes.STRING,
            note: DataTypes.STRING,
            count: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Doctor_info',
            freezeTableName: true,
        },
    );
    return Doctor_info;
};
