module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Admin', {
        _id: {
            type: DataTypes.STRING(256),
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(256),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(256),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(256),
            allowNull: false
        }
    }, {
        tableName: 'Admin'
    });
};