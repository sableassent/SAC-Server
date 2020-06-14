const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
    'username': process.env.MYSQL_USERNAME,
    'password': process.env.MYSQL_PASSWORD,
    'database': process.env.MYSQL_DATABASE,
    'host': process.env.MYSQL_HOST,
    'dialect': 'mysql',
    'logging': false,
    'define': {
        'timestamps': false
    },
    'dialectOptions': {
        connectTimeout: 60 * 1000
    },
    'pool': {
        max: 100,
        min: 0,
        idle: 10000
    }
});

module.exports.db = sequelize;

module.exports.authenticate = () => {
    sequelize.authenticate().then(() => {
        console.log('Database connected successfully.');
    }).catch(err => {
        console.error('Unable to connect to the database:', err);
    });
}

module.exports.sync = async () => {
    await sequelize.sync();
}