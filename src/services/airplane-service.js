const {StatusCodes} = require('http-status-codes');

const {AirplaneRepository} = require ('../repositories');
const AppError = require('../utils/errors/app-error')

const airplaneRepository = new AirplaneRepository();

async function createAirplane(data){
    try{
        const airplane = await airplaneRepository.create(data);
        return airplane
    }catch(error){
        if(error.name === 'SequelizeValidationError'){
            let explaination = [];
            error.errors.forEach((err)=>{
                explaination.push(err.message);
            })
            console.log(explaination);
            throw new AppError(explaination, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create a new Airplane object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createAirplane,
}