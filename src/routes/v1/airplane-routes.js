const express = require('express')
const router = express.Router();

const {AirplaneController} = require('../../controller')
const {AirplaneMiddleware} = require('../../middleware')



// /api/v1/airplane POST
router.post('/', 
    AirplaneMiddleware.validateCreateRequest,
    AirplaneController.createAirplane,
    
);

module.exports = router;