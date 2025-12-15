const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/errors/app-error");
const { AirplaneRepository, FlightRepository } = require("../repositories");
const { Op } = require("sequelize");

const airplaneRepository = new AirplaneRepository();
const flightRepository = new FlightRepository();

/*Create Flight: 
 * Flow = fetch Capacity from airplane and fill in totalSeats
*/
async function createFlight(data) {
  try {
    //fetch airplane from airplaneId to get seats: (use microservice api call later)
    if (!data.totalSeats) {
      const airplane = await airplaneRepository.get(data.airplaneId);
      data.totalSeats = airplane.capacity;
    }

    const flight = await flightRepository.create(data);
    return flight;
  } catch (error) {
    if (error.name == "SequelizeValidationError") {
      let explanation = [];
      error.errors.forEach((err) => {
        explanation.push(err.message);
      });

      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    }

    // Catch Foreign Key errors
    if (error.name == "SequelizeForeignKeyConstraintError") {
      throw new AppError(
        "Invalid Airplane ID or Airport ID provided",
        StatusCodes.BAD_REQUEST
      );
    }

    throw new AppError(
      "Caanot create a new flight object",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function getAllFlights(query) {
  let customFilter = {};
  let sortFilter = [];
  const endingTripTime = " 23:59:00";

  //handling arrival & departure airports code
  if (query.departureAirportId) {
    customFilter.departureAirportId = query.departureAirportId;
  }
  if (query.arrivalAirportId) {
    customFilter.arrivalAirportId = query.arrivalAirportId;
  }

  //Handling price range
  if (query.minPrice && query.maxPrice) {
    customFilter.price = {
      [Op.between]: [query.minPrice, query.maxPrice],
    };
  } else if (query.minPrice) {
    customFilter.price = {
      [Op.gte]: query.minPrice,
    };
  } else if (query.maxPrice) {
    customFilter.price = {
      [Op.lte]: query.maxPrice,
    };
  }

  //Handling seats availabilty check: totalSeats should be more than travellers entered
  if (query.travellers) {
    customFilter.totalSeats = {
      [Op.gte]: query.travellers,
    };
  }

  //Trip availability
  if (query.tripDate) {
    customFilter.departureTime = {
      [Op.between]: [query.tripDate, query.tripDate + endingTripTime],
    };
  }

  //Sorting: on arrival, departure, price etc. It will be like sort=departureTime_ASC, price_DESC (comma sep)
  if (query.sort) {
    const params = query.sort.split(",");
    const sortFilters = params.map((param) => param.split("_"));
    sortFilter = sortFilters;
  }

  

  try {
    const flights = await flightRepository.getAllFlights(
      customFilter,
      sortFilter
    );
    return flights;
  } catch (error) {
    console.log(error);
    throw new AppError(
      "Cannot fetch data of all the flights",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

//Get single flight using id
async function getFlight(flightId){
    try {
        const flight = await flightRepository.get(flightId);
        if(!flight) {
            throw new AppError('The flight you requested is not found', StatusCodes.NOT_FOUND);
        }
        return flight;
    } catch(error) {
        if(error.statusCode == StatusCodes.NOT_FOUND) {
            throw error;
        }
        throw new AppError('Cannot fetch data of the flight', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

//Update seat count after booking
async function updateSeats(data) {
    try {
        const response = await flightRepository.updateRemainingSeats(data.flightId, data.seats, data.dec);

        return response
    } catch (error) {
        console.log('Update seats error', error);
        if(error instanceof AppError) throw error;
        throw new AppError('Cannot update seats for the flight', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


module.exports = {
    createFlight,
    getAllFlights,
    getFlight,
    updateSeats
}