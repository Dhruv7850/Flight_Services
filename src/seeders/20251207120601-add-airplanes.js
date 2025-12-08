'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     * name: 'John Doe',
     * isBetaMember: false
     * }], {});
    */

    //Since seederd donot add createdAt and updatedAt automatically, we need to manually add
    await queryInterface.bulkInsert('airplanes', [
      {
        modelNumber: 'Boeing737',
        capacity: 300,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        modelNumber: 'AirbusA320',
        capacity: 350,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        modelNumber: 'Boeing777',
        capacity: 400,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        modelNumber: 'Boeing747',
        capacity: 320,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        modelNumber: 'AirbusA330',
        capacity: 150,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    // We use Op.or to delete only the rows we inserted, 
    // to avoid wiping data that might have been added manually.
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete('airplanes', { 
      modelNumber: { [Op.in]: ['Boeing737', 'AirbusA320', 'Boeing777', 'Boeing747', 'AirbusA330'] } 
    });
  }
};