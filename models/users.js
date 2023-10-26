const Connections = require('./../dbconfig');
const {DataTypes} = require('sequelize');
const bcrypt = require('bcrypt')


const dbConnection = Connections.connect;

const Users = dbConnection.define('users',{
    user_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: DataTypes.STRING
    },
    lastName: {
        type: DataTypes.STRING
    },
    lastName: {
        type: DataTypes.STRING
    },
    username: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    }
},
{
    freezeTableName: true,
    timesTamps: false
});


            dbConnection.sync();  



const createUser = function (firstName, lastName, username, password, email) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    Users.create({ firstName, lastName, username, password: hashedPassword, email })
};

const findUser = async function(username, password) {
    try {
        const user = await Users.findOne({ where: { username } });

        if (user) {
            const result = bcrypt.compareSync(password, user.password);
            if (result) {
                return user;
            }
        } else {
            // Handle the case where the user is not found
            return user;
        }
    } catch (error) {
        console.log(`Error Finding users:`, error);
        throw error;
    }
};


module.exports = { Users, findUser,createUser };

