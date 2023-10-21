const Connections = require('../dbconfig/index')
const Users =require('../models/users')
const Boom= require('@hapi/boom')

const routes = [
    {
        method : 'POST',
        path : '/login',
        handler : (request,h)=>{
            if(request.payload.username === '' && request.payload.password === '') {
                return h.redirect('/')
            }else{
            Users.createUser(request.payload.username, request.payload.password)
            return h.view('index', {username : request.payload.username})
            }
        }
    }, 
    {
        method: 'GET',
        path: '/loginBasic',
        handler: (request,h)=>{
            const name= request.auth.credentials.name;
            return "Welcome ${name} to my restricted page"
        },
        options: {
            auth: 'login'
        }
    },
    {
        method: 'GET',
        path: '/logoutBasic',
        handler: (request,h)=>{
            return Boom.unauthorized('you have been logout success');
        }
    },
    {
        method : 'GET',
        path : '/',
        handler : (request,h)=>{
            return h.file('welcome.html')
        },
    }, 
    {
        method : 'GET',
        path : '/getUsers',
        handler : async (request,h)=>{
            const dbConnection = await Connections.connect();
            console.log(users);
            return h.view('index', {users})
        }
    },
    {
        method : 'GET',
        path : '/{any*}',
        handler : (request,h)=>{
            return `<h1>you got wrong direction brow</h1>`
        }
    },
]

module.exports = routes 