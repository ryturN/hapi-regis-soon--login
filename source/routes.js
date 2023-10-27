const Connections = require("../dbconfig/index");
const { findUser } = require("../models/users.js");
const Users = require("../models/users.js");
const Boom = require("@hapi/boom");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const {createUser} = require("../models/users");
const nodemailer = require("nodemailer");
const localStorage = require('localStorage')


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
    path: "/registrasi",
    handler: async (request, h) => {
      const { userVerificationCode } = request.payload;
      
      const dataStorage = JSON.parse(localStorage.getItem('data'));
      console.log("dataStorage:", dataStorage);

      const verificationCode = localStorage.getItem('verify');
      const parsedVerificationCode = parseInt(verificationCode)
      console.log(verificationCode);
      const parsedUserVerificationCode = parseInt(userVerificationCode);
      console.log(parsedUserVerificationCode === parsedVerificationCode);
      if (parsedUserVerificationCode === parsedVerificationCode) {
        createUser(dataStorage.firstName, 
          dataStorage.lastName, 
          dataStorage.username,
          dataStorage.password,
          dataStorage.email)
        console.log(dataStorage['firstName'])
        return h.redirect("/welcome");
      } else {
        return h.response("Verification code does not match").code(400);
      }
    },
    options: {
      auth: {
        mode: "try",
      }
    }
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
        console.log(dataStorage)
        const verificationCode = Math.floor(10000 + Math.random() * 90000);
       localStorage.setItem('data', JSON.stringify(dataStorage));

        console.log(request.state.dataStorage = dataStorage)
        localStorage.setItem('verify', verificationCode);
        console.log(request.state.verificationCode)
        console.log(verificationCode)
        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            // user: 'watashiox@gmail.com',
            pass: "xtcvwuvoxccwcong",
          },
        });

        let mailOptions = {
          from: '"ryan" watashiox@gmail.com',
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
        return h.file("verification.html"); 
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
