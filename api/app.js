const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');
const http = require('http');
const EthereumService = require('./services/ethereum.service');
const mongo = require('./mongo');
const minioClient = require("./minio");

const buckets = [
    "public-images",
    "images",
    "test"
];

_startServer().then(res=> {
    console.log("Started Server");

}).catch(err=> console.log("Error Starting db: "+ err));

function createBuckets () {
    for(let i = 0; i < buckets.length; i++){
        console.log(`Init Bucket ${buckets[i]}`);
        minioClient.bucketExists(buckets[i], function(error) {
            if(error) {
                minioClient.makeBucket(buckets[i], function (err) {
                    if(err){
                        console.log(`Couldn't create bucket ${buckets[i]}`);
                    }
                })
            }
        });
    }
}

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
    // create buckets if not exists
    // createBuckets();

    // EthereumService.updateBalance();
    // EthereumService.updateTransactionStatus();
    return http.createServer(app).listen(8080, "0.0.0.0", function () {
        console.log('Express server started');
    });
}
