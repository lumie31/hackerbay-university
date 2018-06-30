const Sequelize = require("sequelize");

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
  // hooks: {
  //   beforeValidate: function() {}
  // }
});

connection.sync().then(function() {
  User.create({
    email: "johndoe@mail.com",
    password: "hello"
  }).catch(error => {
    console.log(error);
  });
});

User.findAll().then(user => {
  console.log(user);
});
