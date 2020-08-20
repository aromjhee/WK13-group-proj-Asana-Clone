require('dotenv').config(); 

module.exports = {
  environment: process.env.NODE_ENV || "development",
  port: Number.parseInt(process.env.PORT, 10) || 8080,
  sessionSecret: process.env.SESSION_SECRET,
  db: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
  },
};
