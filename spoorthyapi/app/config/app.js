require("dotenv").config();

const env = process.env.NODE_ENV || "development";

config = {
  // App env
  env: process.env.NODE_ENV,

  // App debug mode
  debug: process.env.DEBUG ? process.env.DEBUG === "true" : true,

  // App secret for password encoding
  appSecret: process.env.APP_SECRET || "itsverysecret",

  // Server port
  port: process.env.PORT || process.env.SERVER_PORT || 3000,

  // JWT secret
  jwtSecret: process.env.JWT_SECRET || "itsverysecret",

  // JWT expire time in seconds
  jwtExpire: parseInt(process.env.JWT_EXPIRE, 10) || 3600,

  smsApiKey: process.env.SMS_API_KEY || "",

  smsSenderId: process.env.SMS_SENDER_ID || ""

};

module.exports = config;
