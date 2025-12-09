const {StatusCodes} = require('http-status-codes');

const {AirplaneRepository} = require ('../repositories');
const AppError = require('../utils/errors/app-error');
const { AirplaneService } = require('.');
const { SuccessResponse, ErrorResponse } = require('../utils/common');

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

async function getAirplanes(){
    try{
        const airplane = await airplaneRepository.getAll();
        return airplane
    }catch (error){
       throw new AppError('Cannot fetch data of all the airplanes', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAirplane(id){
    try{
        const airplane = await airplaneRepository.get(id);
        return airplane
    }catch (error){
        if(error.statusCode=== StatusCodes.NOT_FOUND){
            throw new AppError('The airplane you requested is not found',error.statusCode)
        }
       throw new AppError('Cannot fetch data of all the airplanes', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function destroyAirplane(id){
    try{
        const airplane = await airplaneRepository.destroy(id);
        return airplane
    }catch (error){
        if(error.statusCode=== StatusCodes.NOT_FOUND){
            throw new AppError('The airplane you requested is not found',error.statusCode)
        }
       throw new AppError('Cannot fetch data of all the airplanes', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

//update airplane data by id
async function updateAirplane(id, data){
    try {
        const response = await airplaneRepository.update(id, data);
        //updation returns an array of rows affected. If count = 0 means no changes
        if(response[0]==0){
            throw new AppError('The airplane requested to update is not found', StatusCodes.NOT_FOUND)
        }

        return response;
    } catch (error) {
        if(error.statusCode == StatusCodes.NOT_FOUND){
            throw error;
        }

        throw new AppError('Cannot update the airplane data', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


module.exports = {
    createAirplane,
    getAirplanes,
    getAirplane,
    destroyAirplane,
    updateAirplane
}