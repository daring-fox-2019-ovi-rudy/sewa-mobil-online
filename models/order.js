'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    order_date: DataTypes.DATE,
    CustomerId: DataTypes.INTEGER,
    DriverId: DataTypes.INTEGER,
    order_status : DataTypes.INTEGER
  }, {});
  Order.associate = function(models) {
    // associations can be defined here
    Order.belongsTo(models.Customer)
    Order.belongsTo(models.Driver)
  };
  return Order;
};