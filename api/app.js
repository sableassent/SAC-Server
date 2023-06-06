require("dotenv").config();
const Env = require("./env");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./routes");
const http = require("http");
const EthereumService = require("./services/ethereum.service");
const mongo = require("./mongo");
const minioClient = require("./minio");

const buckets = ["public-images", "images", "test"];

_startServer()
  .then((res) => {
    console.log("Started Server");
  })
  .catch((err) => console.log("Error Starting App Server: " + err));

function createBuckets() {
  for (let i = 0; i < buckets.length; i++) {
    const bucketName = `${Env.MINIO_BUCKET_NAME_PREFIX}-${Env.APP_VERSION}-${buckets[i]}`;
    console.log(`Init Bucket ${bucketName}`);
    minioClient.bucketExists(bucketName, function (error) {
      if (error) {
        minioClient.makeBucket(bucketName, function (err) {
          if (err) {
            console.log(`Couldn't create bucket ${bucketName}`, err);
          }
        });
      }
    });
  }
}

async function _startServer() {
  let app = express();
  app.use(cors());
  app.use(bodyParser.json({ extended: true }));
  app.use(bodyParser.urlencoded({ extended: true }));
  // Env.NODE_ENV = process.argv[1] || "local";
  app.use("/", routes);
  // await sequelize.authenticate();
  // await sequelize.sync();
  await mongo.start();
  // create buckets if not exists
  createBuckets();

  EthereumService.updateBalance();
  EthereumService.updateTransactionStatus();
  const server = http.createServer(app).listen(Env.APP_PORT, function () {
    const { port } = server.address();
    Env.APP_PORT = port;
    console.log(
      `🚀🚀🚀 Express server started on: http://${Env.APP_HOST}:${Env.APP_PORT} at ${Env.APP_URL}`
    );
  });
  return server;
}
