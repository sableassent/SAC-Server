const mongoose = require("mongoose");
const validators = require("../mongoValidators");
const AdminSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true
        },
        accessToken: {
            token: {
                type: String,
            },
            isActive: {
                type: Boolean,
            }
        }
    },
    {
        timestamps: true,
        minimize: false,
        versionKey: false
    }
)

AdminSchema.index({ accessToken: -1 });
AdminSchema.index({ email: -1 });

// Handler **must** take 3 parameters: the error that occurred, the document
// in question, and the `next()` function
AdminSchema.post('save', validators.duplicateKey);

module.exports = mongoose.model('Admin', AdminSchema);


// module.exports = function (sequelize, DataTypes) {
//     return sequelize.define('Admin', {
//         _id: {
//             type: DataTypes.STRING(256),
//             allowNull: false,
//             primaryKey: true
//         },
//         name: {
//             type: DataTypes.STRING(256),
//             allowNull: false
//         },
//         email: {
//             type: DataTypes.STRING(256),
//             allowNull: false
//         },
//         password: {
//             type: DataTypes.STRING(256),
//             allowNull: false
//         }
//     }, {
//         tableName: 'Admin'
//     });
// };
