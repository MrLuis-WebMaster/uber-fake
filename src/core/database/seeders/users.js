'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) =>
    queryInterface.bulkInsert(
      'users',
      [
        {
          fullName: 'Jose Aviatrix',
          email: 'joseaviatrix@gmail.com',
          phone: '0123456789',
          role: 'DRIVER',
        },
        {
          fullName: 'Luis Aviatrix',
          email: 'luisaviatrix@gmail.com',
          phone: '0123456789',
          role: 'DRIVER',
        },
        {
          fullName: 'Maria Aviatrix',
          email: 'mariaaviatrix@gmail.com',
          phone: '0123456789',
          role: 'DRIVER',
        },
        {
          fullName: 'Rafael Aviatrix',
          email: 'rafaelaviatrix@gmail.com',
          phone: '0123456789',
          role: 'RIDER',
        },
      ],
      {},
    ),
  down: async (queryInterface) => {
    await queryInterface.dropTable('users');
  },
};
