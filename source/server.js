'use strict';

const Hapi = require("@hapi/hapi");
const routes = require("./routes");
const path =require('path')
const Boom = require('@hapi/boom')

const users = {
  ryan:{
    username: 'watashiox',
    password: 'ryan123',
    id: 0,
    name : 'M Adryan'
  },
  Ziyad:{
    username: 'ziyadzk',
    password: 'ziyad123',
    id: 1,
    name : 'Ziyad'
  },
}

const validate = async(request, username, password, h)=>{

  if(!users[username]){
    return { isValid: true }
  }

  const user = users[username];

  if(user.password === password){
    return {isValid: true,credentials: {id: user.id, name: user.name}};
  } else{
    return {isValid: false}
  }

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
      plugin: require('@hapi/basic')
    },
  ]);

  server.auth.strategy('login', 'basic', { validate })

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
