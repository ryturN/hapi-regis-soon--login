const Connections = require('./../dbconfig');
const {DataTypes} = require('sequelize');


const dbConnection = Connections.connect;

const Users = dbConnection.define('users',{
    user_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    }
},
{
    freezeTableName: true,
    timesTamps: false
});

const findUser= async function(username,password){
    try{
        const user = await Users.findOne({where: {username, password}});
        return user
    }catch(error){
        console.log(`Error Finding users:`, error);
        throw error
    }
}

module.exports = { Users, findUser};

// module.exports.createUser= function(username,password){
//     Users.create({firstName,lastName,fullName, username, password,email,})
//     .then((data)=>{
//         console.log(data.toJSON());
//     })
    
// }
