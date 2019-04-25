'use strict';
const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds)

module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    name: {
      type : DataTypes.STRING,
      validate:{
        len : [3, 10]
      }
    },
    password: {
      type : DataTypes.STRING,
      validate:{
        len : [5, 10]
      }
    },
    phone_number: {
      type : DataTypes.STRING,
      validate:{
        len : [11, 13]
      }
    }
  }, {
      hooks: {
        beforeCreate: (user, options) => {
          user.password = bcrypt.hashSync(user.password, salt);
            // Store hash in your password DB.
      }
    }
  });
  Customer.associate = function(models) {
    // associations can be defined here
    Customer.hasMany(models.Order)
    // Customer.belongsToMany(models.Driver, {through: 'Order'});
  };
  return Customer;
};