'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Flight extends Model {
    static associate(models) {
      // 1. Airplane Association
      this.belongsTo(models.Airplane, {
        foreignKey: 'airplaneId',
        as: 'airplaneDetail'
      });

      // 2. Departure Airport Association
      this.belongsTo(models.Airport, {
        foreignKey: 'departureAirportId',
        as: 'departureAirport'
      });

      // 3. Arrival Airport Association
      this.belongsTo(models.Airport, {
        foreignKey: 'arrivalAirportId',
        as: 'arrivalAirport'
      });
    }
  }

  Flight.init({
    flightNumber: { type: DataTypes.STRING, allowNull: false },
    airplaneId: { type: DataTypes.INTEGER, allowNull: false },
    departureAirportId: { type: DataTypes.STRING, allowNull: false },
    arrivalAirportId: { type: DataTypes.STRING, allowNull: false },
    arrivalTime: { type: DataTypes.DATE, allowNull: false },
    departureTime: { type: DataTypes.DATE, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    boardingGate: DataTypes.STRING,
    totalSeats: { type: DataTypes.INTEGER, allowNull: false }
    // NOTE: NO 'code' column here!
  }, {
    sequelize,
    modelName: 'Flight',
  });
  
  return Flight;
};