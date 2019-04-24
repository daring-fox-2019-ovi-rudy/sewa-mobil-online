'use strict';
module.exports = (sequelize, DataTypes) => {
  const Driver = sequelize.define('Driver', {
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    car_type: DataTypes.STRING,
    max_passenger: DataTypes.INTEGER,
    driver_license: DataTypes.STRING,
    license_plate: DataTypes.STRING,
    basic_rate : DataTypes.INTEGER
  }, {});
  Driver.associate = function(models) {
    // associations can be defined here
  };
  return Driver;
};