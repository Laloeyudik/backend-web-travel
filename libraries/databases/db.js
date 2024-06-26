const sequelize = require("sequelize")
require('dotenv').config();
const db = new sequelize(`${process.env.DB_NAME}`, `${process.env.USER}`, `${process.env.PASSWD}`, {
    host: `${process.env.HOST}`,
    dialect: "mysql"
})

module.exports = db