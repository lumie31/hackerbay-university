const express = require("express");
const Sequelize = require("sequelize");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportLocalSequelize = require("passport-local-sequelize");
const session = require("express-session");

const app = express();

const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "secret",
    saveUninitialized: true,
    resave: true
  })
);

// Passport Init
app.use(passport.initialize());
app.use(passport.session());
// app.get("/", (req, res) => res.status(200).send("success"));

// let data;

// app.post("/data", (req, res) => {
//   data = req.body.data;
//   return res.status(200).json(data);
// });
// app.get("/data", (req, res) => {
//   return res.json(data);
// });

app.listen(port, () => console.log(`Server started on port ${port}`));

//Passport local for Auth
passport.use(
  new LocalStrategy(function(username, password, done) {
    User.findOne({ username: email }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user);
    });
  })
);

// Add postgres connection and db logic
const connection = new Sequelize("hack", "postgres", "lumidizzle31", {
  host: "localhost",
  dialect: "postgres",
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Model the schema for the db
let User = connection.define("user", {
  email: {
    type: Sequelize.STRING,
    unique: true,
    validate: {
      isEmail: true,
      isLowercase: true,
      notEmpty: true
    }
  },
  password: {
    type: Sequelize.STRING
  }
});

app.post("/user/signup", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.json({
      success: false,
      message: "Incorrect details"
    });
  }

  if (email && password) {
    User.beforeValidate((user, options) => {
      return bcrypt.hash(user.password, saltRounds).then(hashedPw => {
        user.password = hashedPw;
      });
    });

    connection.sync().then(function() {
      User.findOrCreate({
        where: {
          email,
          password
        }
      }).spread((userResult, created) => {
        if (created) {
          return res.status(200).json({
            success: true,
            message: "User created successfully"
          });
        }
      });
    });
  }
  // console.log(req.body);
});
