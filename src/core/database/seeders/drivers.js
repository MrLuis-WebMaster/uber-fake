/* eslint-disable prettier/prettier */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) =>
    queryInterface.bulkInsert('drivers', [
      {
        location: JSON.stringify({
          latitude: '40.7128',
          longitude: '-74.0060',
        }),
        isAvailable: true,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        location: JSON.stringify({
          latitude: '34.0522',
          longitude: '-118.243',
        }),
        isAvailable: false,
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        location: JSON.stringify({
          latitude: '41.8781',
          longitude: '-87.6298',
        }),
        isAvailable: true,
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),
  down: async (queryInterface) => {
    await queryInterface.dropTable('drivers');
  },
};