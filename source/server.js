'use strict';

const Hapi = require("@hapi/hapi");
const routes = require("./routes");
const path =require('path')
const Boom = require('@hapi/boom')
const Users = require("../models/users");
const {findUser} = require("../models/users");


const users = {
  watashiox:{
    username: 'watashiox',
    password: 'ryan123',
    id: 0,
    name : 'watashiox'
  },
  Ziyad:{
    username: 'ziyadzk',
    password: 'ziyad123',
    id: 1,
    name : 'Ziyad'
  },
}

const init = async () => {
  const server = Hapi.server({
    port: 1234,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
      files : {
        relativeTo: path.join(__dirname,'../inert')
      }
    },
  });

  await server.register([
    {
      plugin: require("hapi-geo-locate"),
      options: {
        enabledByDefault: true,
      },
    },
    {
      plugin: require('@hapi/inert'),
    },
    {
      plugin: require('@hapi/vision'),
    },
    {
      plugin: require('@hapi/basic'),
    },
    {
      plugin: require('@hapi/cookie'),
    },
  ]);

  // server.auth.strategy('login','cookie', {
  //   cookie: {
  //     name: 'session',
  //     password: 'ryanryanryanryanryanryanryanryanryarnaryha',
  //     isSecure: false,
  //     ttl: 30000
  //   },
  //   redirectTo: '/login',
  //   validate: async (request,session)=>{
  //     if(session.username === 'ryan' && session.password === 'ryan123'){
  //       return {isValid: true,credentials: {username: 'mie ayam'}}; 
  //     }else{
  //       return {isValid: false};
  //     }
  //   }
  // })
  server.auth.strategy('login','cookie', {
    cookie: {
      name: 'session',
      password: 'ryanryanryanryanryanryanryanryanryarnaryha',
      isSecure: false,
      ttl: 30000
    },
    redirectTo: '/login',
    validate: async (request, session) => {
      if (session.username && session.password) {
        if (findUser(session.username , session.password)) {
          return { isValid: true, credentials: { username: session.username } };
        }
      }
          return {isValid : false};
    }
  });

  server.auth.default('login');

  server.views({
    engines:{
      hbs: require('handlebars')
    },
    path: path.join(__dirname,'../views'),
    layout: 'default'
  })

  

  server.route(routes);

  await server.start();
  console.log(`Server Running on ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
