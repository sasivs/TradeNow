require('dotenv').config()

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.APP_DATABASE, process.env.APP_DATABASE_USER, process.env.APP_DATABASE_PASSWORD, {
  host: "localhost",
  dialect: "postgresql",
});

const connectDB = (sequelize) => {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch((err) => {
      console.error("Unable to connect to the database:", err);
    });
};

module.exports = {connectDB, sequelize};
