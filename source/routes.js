const Connections = require("../dbconfig/index");
const {findUser} = require("../models/users");
const Users = require("../models/users");
const Boom = require("@hapi/boom");

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
      return `Hallo ${request.auth.credentials.username} Selamat datang di web yang bodoh ini`;
    },
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
  {
    method: "GET",
    path: "/{any*}",
    handler: (request, h) => {
      return `<h1>you got wrong direction brow</h1>`;
    },
    options: {
      auth: {
        mode: "try",
      },
    },
  },
];

module.exports = routes;
