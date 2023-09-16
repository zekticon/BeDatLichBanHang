'use strict';
const { Model } = require('sequelize');
const PROTECTED_ATTRIBUTES = ['password'];
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        toJSON() {
            // hide protected fields
            let attributes = Object.assign({}, this.get());
            for (let a of PROTECTED_ATTRIBUTES) {
                delete attributes[a];
            }
            return attributes;
        }
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User.belongsTo(models.Allcode, {
                foreignKey: 'positionId',
                targetKey: 'key',
                as: 'positionData',
            });
            User.belongsTo(models.Allcode, {
                foreignKey: 'gender',
                targetKey: 'key',
                as: 'genderData',
            });

            User.hasOne(models.Image, { foreignKey: 'user_id' });

            User.hasMany(models.Review, {
                foreignKey: 'user_id',
            });

            User.hasOne(models.Doctor_info, { foreignKey: 'doctorId' });
            User.hasOne(models.Markdown, { foreignKey: 'user_id' });
            User.hasOne(models.Booking, { foreignKey: 'patientId' });
        }
    }
    User.init(
        {
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            review_id: DataTypes.INTEGER,
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            address: DataTypes.STRING,
            phonenumber: DataTypes.STRING,
            gender: DataTypes.STRING,
            roleId: DataTypes.STRING,
            positionId: DataTypes.STRING,
            rememberToken: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'User',
        },
    );
    return User;
};
