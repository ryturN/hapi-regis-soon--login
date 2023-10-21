const Sequelize = require('sequelize');

const dbConnection = new Sequelize('hapi_tutorial','root','ryan14',{
    host : 'localhost',
    port: 3306,
    dialect: 'mysql'
});


module.exports.connect = dbConnection