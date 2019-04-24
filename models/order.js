'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    order_date: DataTypes.DATE,
    CustomerId: DataTypes.INTEGER,
    DriverId: DataTypes.INTEGER,
    fees: DataTypes.INTEGER
  }, {});
  Order.associate = function(models) {
    // associations can be defined here
  };
  return Order;
};