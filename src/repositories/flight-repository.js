
const { Flight, Airplane, Airport, City } = require("../models"); 
const CrudRepository = require("./crud-repository");
const { Sequelize } = require('sequelize');
const db = require('../models'); 
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');


class FlightRepository extends CrudRepository {
  constructor() {
    super(Flight);
  }

  async get(id) {
    const response = await Flight.findByPk(id, {
      include: [
        {
          model: Airplane,
          required: true,
          as: "airplaneDetail",
        },
        {
          model: Airport,
          required: true,
          as: "departureAirport",
          include: {
            model: City,
            required: true,
          },
        },
        {
          model: Airport,
          required: true,
          as: "arrivalAirport",
          include: {
            model: City,
            required: true,
          },
        },
      ],
    });
    return response;
  }

  async getAllFlights(filter, sort) {
    //filter object comes from service layer as example {departureId: 'DEL', price: {[Op.gte]:400}}
    console.log("DEBUG FLIGHT ATTRIBUTES:", Object.keys(Flight.rawAttributes));
    
    const response = await Flight.findAll({
      where: filter, //its an object
      order: sort,
      include: [
        //Joins to get airplane details
        {
          model: Airplane,
          required: true,
          as: "airplaneDetail",
        },
        {
          //join to get departure details along with city
          model: Airport,
          required: true,
          as: "departureAirport",
          //'On' not req since join condition fixed in association by targetKey. By default On does on key=id
          // on:{
          //     col1: Sequelize.where(Sequelize.col("Flight.departureAirportId"),"=",Sequelize.col("departure_airport.code"))
          // }
          include: {
            model: City,
            required: true,
          },
        },
        {
          //Join to get arrival details
          model: Airport,
          required: true,
          as: "arrivalAirport",
          //'On' not req since join condition fixed in association by targetKey. By default On does on key=id. If using on, rmeove targetKey from models.
          // on:{
          //     col1: Sequelize.where(Sequelize.col("Flight.arrivalAirportId"),"=",Sequelize.col("arrival_airport.code"))
          // }
          include: {
            model: City,
            required: true,
          },
        },
      ],
    });

    return response;
  }

  //Update remaining seats after Booking(invoked from booking microservice)
  async updateRemainingSeats(flightId, seats, dec = true) {
    //Start a transaction
    const transaction = await db.sequelize.transaction();

    try {
      //Pessimitic Concurrency (Lock the row) using lock: true. Its similar to FOR UPDATE at end of SQL query
      const flight = await db.Flight.findByPk(flightId, {
        lock: true,
        transaction: transaction,
      });

      if (!flight) {
        throw new AppError("Flight not found", StatusCodes.NOT_FOUND);
      }

      //Else, compute logic to decrease seats within lock
      if (dec) {
        if (flight.totalSeats < seats) {
          throw new AppError(
            "Not enough seats for booking",
            StatusCodes.BAD_REQUEST
          );
        }
        //else, decrease
        await flight.decrement("totalSeats", {
          by: seats,
          transaction: transaction,
        });
      } else {
        //If dec=false, means seats cancelled
        await flight.increment("totalSeats", {
          by: seats,
          transaction: transaction,
        });
      }

      //Commit changes and release the lock
      await transaction.commit();
      return flight;
    } catch (error) {
      //rollback
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = FlightRepository;
