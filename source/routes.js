const Connections = require("../dbconfig/index");
const {findUser} = require("../models/users.js");
const Users = require("../models/users.js");
const Boom = require("@hapi/boom");
const Joi= require("@hapi/joi")
const bcrypt = require('bcrypt')
const {createUser} = require('../models/users')


// const routes = [
//     {
//         method : 'POST',
//         path : '/login',
//         handler : (request,h)=>{
//             if(request.payload.username === 'ryan' && request.payload.password === 'ryan123'){
//                 request.cookieAuth.set({username: request.payload.username, password: request.payload.password })
//                 return h.redirect('/welcome');
//             } else{
//                 return h.redirect('/');
//             }
//         },
//         options:{
//             auth:{
//                 mode: 'try'
//             }
//         }
//     },
const routes = [
    {
        method: 'POST',
        path: '/login',
        handler: async (request, h) => {
          const { username, password } = request.payload;
          const user = await findUser(username, password);
          if (user) {
            request.cookieAuth.set({ username: user.username, password: user.password });
            return h.redirect('/welcome');
          } else {
            return h.redirect('/');
          }
        },
        options: {
          auth: {
            mode: 'try'
          }
        }
      },
    // {
  //     method: 'POST',
  //       path: '/register',
  //       options: {
  //           validate: {
  //               payload: Joi.object({
  //                   username: Joi.string().alphanum().min(3).max(30).required(),
  //                   password: Joi.string()
  //                       .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})'))
  //                       .required()
  //                       .messages({
  //                           'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number, and be at least 8 characters long.'
  //                       }),
  //                   email: Joi.string().email().required(),
  //                   firstname: Joi.string().alphanum().min(3).max(30).required(),
  //                   lastname: Joi.string().alphanum().min(3).max(30).required(),
  //               })
  //           }
  //       },
  //     handler: async (request, h) => {
  //         try{
  //           const {username ,password,email,firstname,lastname}= request.payload
  //           createUser(firstname,lastname,username,password,email);
  //           return h.response('User registered successfully!').code(200)
  //         }catch(error){
  //           return h.response('Error registering user').code(500)
  //         }
  //     }
  // },
  {
    method: 'POST',
    path: '/registrasi',
    handler: async (request, h) => {
        const { firstName, lastName, username, password } = request.payload;
        try {
            await createUser(firstName, lastName, username, password);
            return h.view('welcome.html');
        } catch (error) {
            console.error('Error in route handler:', error);
            return h.response('Internal server error').code(500);
        }
    },
    options: {
        auth: {
            mode: 'try'
        }
    }
},
  {
    method: "GET",
    path: "/logout",
    handler: (request, h) => {
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },
  {
    method: "GET",
    path: "/welcome",
    handler: (request, h) => {
      // return `Hallo ${request.auth.credentials.username} Selamat datang di web yang bodoh ini`;
      return h.file('index.html');
    },
  },
  {
    method: "GET",
    path: "/kontak",
    handler: (request, h) => {
      return h.file('contact.html');
    },
  },
  {
    method: "GET",
    path: "/registrasi",
    handler: (request, h) => {
      return h.file("registration.html");
    },
    options: {
      auth: {
        mode: 'try'
      }
    }
  },
  {
    method: "GET",
    path: "/loginBasic",
    handler: (request, h) => {
      const name = request.auth.credentials.name;
      return `Welcome ${name} to my restricted page`;
    },
    options: {
      auth: "login",
    },
  },
  {
    method: "GET",
    path: "/logoutBasic",
    handler: (request, h) => {
      return Boom.unauthorized("you have been logout success");
    },
  },
  {
    method: "GET",
    path: "/",
    handler: (request, h) => {
      if (request.auth.isAuthenticated) {
        return h.redirect("/welcome");
      }
      return h.file("welcome.html");
    },
    options: {
      auth: {
        mode: "try",
      },
    },
  },
  {
    method: "GET",
    path: "/getUsers",
    handler: async (request, h) => {
      const dbConnection = await Connections.connect();
      console.log(users);
      return h.view("index", { users });
    },
  },
  // {
  //   method: "GET",
  //   path: "/{any*}",
  //   handler: (request, h) => {
  //     return `<h1>you got wrong direction brow</h1>`;
  //   },
  //   options: {
  //     auth: {
  //       mode: "try",
  //     },
  //   },
  // },
];

module.exports = routes;
