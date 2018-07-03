const express = require("express");
const Sequelize = require("sequelize");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const jwt = require("jsonwebtoken");

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
        } else {
          return res.status(400).json({
            message: false,
            message: "User already exists"
          });
        }
      });
    });
  }
});

//Passport local for Auth
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    function(email, password, done) {
      return User.findOne({ email, password })
        .then(user => {
          if (!user) {
            return done(null, false, {
              message: "Incorrect email or password"
            });
          }
          return done(null, user, { message: "Logged In Successfully" });
        })
        .catch(err => done(err));
    }
  )
);

app.post("/user/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: "Something is not right",
        user
      });
    }
    req.login(user, err => {
      if (err) {
        return res.send(err);
      }
      const token = jwt.sign(user, "secrettoken123");
      return res.json({
        success: true,
        token: "JWT" + token,
        user
      });
    });
  })(req, res);
});

app.listen(port, () => console.log(`Server started on port ${port}`));
