'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    order_date: DataTypes.DATEONLY,
    CustomerId: DataTypes.INTEGER,
    DriverId: DataTypes.INTEGER,
    status : DataTypes.INTEGER
  }, {});
  Order.associate = function(models) {
    // associations can be defined here
    Order.belongsTo(models.Driver)
    Order.belongsTo(models.Customer)
  };

  return Order;
};