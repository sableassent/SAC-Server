// TODO: Contact project Admins for access to the organization's email account
// TODO: and use it for signing into all the accounts below

const Env = {
  APP_HOST: process.env.APP_HOST ?? "localhost",
  APP_PORT: parseInt(process.env.PORT ?? process.env.APP_PORT) ?? 8085,
  APP_URL: process.env.APP_URL ?? `${this.APP_HOST}:${this.APP_PORT}`,
  APP_NAME: process.env.APP_NAME ?? "sac-api-server",
  APP_VERSION: process.env.APP_VERSION ?? "v1",

  PASSWORD_SALT:
    process.env.PASSWORD_SALT ??
    "<run `openssl rand -hex 64` to generate a secured key>",

  // TODO: Contact Project Admins for the following [CHAIN. HARDFORK, SAC1_ADDRESS]
  CHAIN: parseInt(process.env.CHAIN) ?? 5,
  HARDFORK: process.env.HARDFORK ?? "",
  SAC1_ADDRESS: process.env.SAC1_ADDRESS ?? "",

  // ALCHEMY: Signup for an [Alchemy Account](https://auth.alchemy.com/signup?redirectUrl=https%3A%2F%2Fdashboard.alchemy.com%2Fsignup%2F%3Freferrer_origin%3DDIRECT),
  // get the credentials in the welcome guide
  ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY ?? "",
  ALCHEMY_API_ENDPOINT: process.env.ALCHEMY_API_ENDPOINT ?? "",
  ALCHEMY_WEBSOCKETS: process.env.ALCHEMY_WEBSOCKETS ?? "",

  // SENDGRID: Get your [API Key here](https://app.sendgrid.com/settings/api_keys)
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ?? "",

  // MONGO_URL: signup for a [MongoDB Atlas account](https://account.mongodb.com/account/register),
  // create an organization, then a project, then a database and get the full connection string
  MONGO_URL: process.env.MONGO_URL ?? "",

  // TWILIO: Get your Twilio credentials from your [Twilio Console](https://console.twilio.com/)
  TWILIO_ACCOUNTSID: process.env.TWILIO_ACCOUNTSID ?? "",
  TWILIO_AUTHTOKEN: process.env.TWILIO_AUTHTOKEN ?? "",
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER ?? "",

  // MINIO: Follow the [Javascript Docs](https://min.io/docs/minio/linux/developers/javascript/minio-javascript.html)
  MINIO_ENDPOINT: process.env.MINIO_ENDPOINT ?? "play.min.io" ?? "localhost",
  MINIO_PORT: parseInt(process.env.MINIO_PORT) ?? 9000,
  MINIO_ACCESS_KEY:
    process.env.MINIO_ACCESS_KEY ?? "Q3AM3UQ867SPQQA43P2F" ?? "minio-root-user",
  MINIO_SECRET_KEY:
    process.env.MINIO_SECRET_KEY ??
    "zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG" ??
    "minio-root-password",
  MINIO_USE_SSL: Boolean(process.env.MINIO_USE_SSL),
  MINIO_REGION: process.env.MINIO_REGION ?? "us-east-2",
  MINIO_BUCKET_NAME_PREFIX:
    process.env.MINIO_BUCKET_NAME_PREFIX ?? this.APP_NAME,
};

module.exports = Env;
