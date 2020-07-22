const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');
const http = require('http');
const sequelize = require('./sequelize');
const EthereumService = require('./services/ethereum.service');
const mongo = require('./mongo');

_startServer().then(res=> {
    console.log("Started Server");

}).catch(err=> console.log("Error Starting db: "+ err));

async function _startServer() {
    let app = express();
    app.use(cors());
    app.use(bodyParser.json({ extended: true }));
    app.use(bodyParser.urlencoded({ extended: true }));
    process.env.NODE_ENV = process.argv[1] || 'local';
    app.use('/', routes);
    // await sequelize.authenticate();
    // await sequelize.sync();
    await mongo.start();

    EthereumService.updateBalance();
    EthereumService.updateTransactionStatus();
    return http.createServer(app).listen(80, "0.0.0.0", function () {
        console.log('Express server started');
    });
}
