'use strict';
const {Enums} = require('../utils/common')
const { BUSINESS, ECONOMY, PREMIUM_ECONOMY, FIRST_CLASS } = Enums.SEAT_TYPE;
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Seats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      airplane_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "airplanes",
          key: "id",
        },
        onDelete: "CASCADE", // If Airplane is deleted, delete its seats
      },
      row: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      col: {
        type: Sequelize.STRING, // 'A', 'B', 'C'
        allowNull: false,
      },
      type: {
        // classType
        type: Sequelize.ENUM,
        values: [BUSINESS, ECONOMY, PREMIUM_ECONOMY, FIRST_CLASS],
        defaultValue: ECONOMY,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Seats');
  }
};