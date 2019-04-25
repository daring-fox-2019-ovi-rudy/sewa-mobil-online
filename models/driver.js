const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

'use strict';
module.exports = (sequelize, DataTypes) => {
  const Driver = sequelize.define('Driver', {
    name: {
      type : DataTypes.STRING
    },
    password: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    car_type: DataTypes.STRING,
    max_passenger: DataTypes.INTEGER,
    driver_license: {
      type : DataTypes.STRING,
      validate : {
        len : [11,13],
        isInt: true
      }
    },
    license_plate: {
      type : DataTypes.STRING,
      validate : {
        len : [3,6],
        notEmpty: true,
        notContains: ' ',
      }
    },
    basic_rate : DataTypes.INTEGER
  }, {
    hooks : {
      beforeCreate : (driver, options) => {
        switch(driver.car_type){
          case "jeep" : driver.max_passenger = 5 ; break;
          case "suv" : driver.max_passenger = 5 ; break;
          case "sedan" : driver.max_passenger = 3 ; break;
        }
        driver.password = bcrypt.hashSync(driver.password, salt);
      }
    }
  });
  Driver.associate = function(models) {
    // associations can be defined here
  };
  return Driver;
};