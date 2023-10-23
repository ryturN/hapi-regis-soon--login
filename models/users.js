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
    console.log('User created successfully');
};

const findUser= async function(username,password){
    try{
        const user = await Users.findOne({where: {username, password}});
        return user
    }catch(error){
        console.log(`Error Finding users:`, error);
        throw error
    }
}



// module.exports.createUser = function (username, password, email, firstName, lastName, fullName) {
//     const hashedPassword = bcrypt.hashSync(password, 10); 

//     const user = {
//         username: username,
//         password: hashedPassword,
//         email: email,
//         firstName: firstName,
//         lastName: lastName,
//         fullName: fullName
//     }.then((data)=>{
//         console.log(data.toJSON)
//     });

//     connection.query('INSERT INTO users SET ?', user, (error, results, fields) => {
//         if (error) throw error;
//         console.log('User created successfully!');
//     });
// };

module.exports = { Users, findUser,createUser };

