const Connections = require("../dbconfig/index");
const { findUser } = require("../models/users.js");
const Users = require("../models/users.js");
const Boom = require("@hapi/boom");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const { createUser } = require("../models/users");
const nodemailer = require("nodemailer");

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
    method: "POST",
    path: "/login",
    handler: async (request, h) => {
      const { username, password } = request.payload;
      const user = await findUser(username, password);
      if (user) {
        request.cookieAuth.set({ username, password });
        return h.redirect("/welcome");
      } else {
        return h.redirect("/");
      }
    },
    options: {
      auth: {
        mode: "try",
      },
    },
  },
  {
    method: "POST",
    path: "/verify",
    handler: async (request, h) => {
      try {
        const dataStorage = {
          firstName: request.payload.firstName,
          lastName: request.payload.lastName,
          username: request.payload.username,
          password: request.payload.username,
          email: request.payload.email,
        };
        const verificationCode = Math.floor(10000 + Math.random() * 90000);
       h.state.dataStorage = dataStorage;

        console.log(h.state.dataStorage = dataStorage)
        // h.state("data", JSON.stringify(dataStorage), {
        //     encoding: "none",
        //     ttl: 3600000,
        //     isSecure: true,
        //     isHttpOnly: true,
        //     isSameSite: "Strict",
        //   })
        h.state.verificationCode = verificationCode;
        console.log(h.state.verificationCode)
        // h.state("verificationCode", verificationCode.toString(), {
        //     encoding: "none",
        //     ttl: 3600000,
        //     isSecure: true,
        //     isHttpOnly: true,
        //     isSameSite: "Strict",
        //   });
        // console.log(verificationCode);
        // console.log(firstName);
        // console.log(h.state("data", JSON.stringify(dataStorage)));
        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: '<your@gmail.com>',
            pass: "yourpassword",
          },
        });

        let mailOptions = {
          from: '"yourname" <your@gmail.com>',
          to: request.payload.email,
          subject: "Verification Code",
          text: `Your verification code is ${verificationCode}.`,
          html: `<b>Your verification code is ${verificationCode}.</b>`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
            return h.response("Error sending email").code(500);
          }
          console.log("Message sent: %s", info.messageId);
        });
        return h.file("verification.html"); // Add this line to return a valid response
      } catch (error) {
        console.error("Error in route handler:", error);
        return h.response("Internal server error").code(500);
      }
    },
    options: {
      state: {
        parse: true,
        failAction: "error",
      },
      auth: {
        mode: "optional",
      },
    },
  },
  {
    method: "POST",
    path: "/registrasi",
    handler: async (request, h) => {
      const { userVerificationCode } = request.payload;
      const dataStorage = request.state.dataStorage;
      console.log("dataStorage:", dataStorage);
      const { firstName, lastName, username, password, email } = dataStorage;
      console.log(firstName, lastName, username);
      const verificationCode = parseInt(request.state.verificationCode);
      console.log(verificationCode);
      const parsedUserVerificationCode = parseInt(userVerificationCode);
      console.log(parsedUserVerificationCode === verificationCode);
      if (parsedUserVerificationCode === verificationCode) {
        await createUser(dataStorage);
        request.cookieAuth.set({ username, password });
        return h.redirect("/welcome");
      } else {
        return h.response("Verification code does not match").code(400);
      }
    },
    options: {
      auth: {
        mode: "try",
      },
      state: {
        parse: true,
        failAction: "error",
      },
    },
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
      return h.file("index.html");
    },
  },
  {
    method: "GET",
    path: "/verify",
    handler: (request, h) => {
      return h.file("verification.html");
    },
  },
  {
    method: "GET",
    path: "/kontak",
    handler: (request, h) => {
      return h.file("contact.html");
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
        mode: "try",
      },
    },
  },
  {
    method: "GET",
    path: "/",
    handler: (request, h) => {
      if (request.auth.isAuthenticated) {
        return h.redirect("/welcome");
      } else {
        return h.file("welcome.html");
      }
    },
    options: {
      auth: {
        mode: "try",
      },
    },
  },
  // {
  //   method: "GET",
  //   path: "/getUsers",
  //   handler: async (request, h) => {
  //     const dbConnection = await Connections.connect();
  //     console.log(users);
  //     return h.view("index", { users });
  //   },
  // },
  {
    method: "GET",
    path: "/{any*}",
    handler: (request, h) => {
      return h.redirect("/");
    },
    options: {
      auth: {
        mode: "try",
      },
    },
  },
];

module.exports = routes;
