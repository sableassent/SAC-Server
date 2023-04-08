const Env = require("./env");
const Minio = require("minio");

let minioClient = new Minio.Client({
  endPoint: Env.MINIO_ENDPOINT,
  port: Env.MINIO_PORT,
  useSSL: Env.MINIO_USE_SSL,
  accessKey: Env.MINIO_ACCESS_KEY,
  secretKey: Env.MINIO_SECRET_KEY,
  region: Env.MINIO_REGION,
});

module.exports = minioClient;
