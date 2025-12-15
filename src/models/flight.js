'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Flight extends Model {
    static associate(models) {
      // DEBUG LOG to prove this new file is running
      console.log(">>> ✅ EXECUTING ASSOCIATIONS FROM THE NEW FILE");

      this.belongsTo(models.Airplane, {
        foreignKey: 'airplaneId',
        as: 'airplaneDetail'
      });
      this.belongsTo(models.Airport, {
        foreignKey: 'departureAirportId',
        as: 'departureAirport'
      });
      this.belongsTo(models.Airport, {
        foreignKey: 'arrivalAirportId',
        as: 'arrivalAirport'
      });
    }
  }

  Flight.init({
    flightNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    airplaneId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    departureAirportId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    arrivalAirportId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    arrivalTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    departureTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    boardingGate: DataTypes.STRING,
    totalSeats: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
    // NOTE: 'code' is purposely REMOVED from here
  }, {
    sequelize,
    modelName: 'Flight',
  });
  
  return Flight;
};