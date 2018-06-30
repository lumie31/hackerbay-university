const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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

User.beforeValidate((user, options) => {
  return bcrypt.hash(user.password, saltRounds).then(hashedPw => {
    user.password = hashedPw;
  });
});

connection.sync().then(function() {
  User.create({
    email: "jondoe@mail.com",
    password: "dkdkdoh"
  }).catch(error => {
    console.log(error);
  });
});

User.findAll().then(user => {
  console.log(user);
});
