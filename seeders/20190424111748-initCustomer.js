'use strict';
const fs = require('fs')
const rawData = JSON.parse(fs.readFileSync('../peer-project/customersInit.json'))
rawData.forEach(data=>{
  data.createdAt = new Date
  data.updatedAt = new Date
})

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
   return queryInterface.bulkInsert('Customers', rawData, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bulkDelete('Customers', null, {});
  }
};
