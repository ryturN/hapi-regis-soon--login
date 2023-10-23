const Sequelize = require('sequelize');
require ("dotenv").config();

const dbConnection = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
    host : process.DB_HOST,
    port: process.B_PORT,
    dialect: 'mysql',
});


module.exports.connect = dbConnection