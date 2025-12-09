const express = require('express')
const router = express.Router();

const {AirplaneController} = require('../../controller')
const {AirplaneMiddleware} = require('../../middleware')

// /api/v1/airplane POST
router.post('/', 
    AirplaneMiddleware.validateCreateRequest,
    AirplaneController.createAirplane,  
);
// /api/v1/airplane GET
router.get('/', AirplaneController.getAirplanes,);

router.get('/:id',  AirplaneController.getAirplane, );

router.delete('/:id', AirplaneController.destroyAirplanes);

router.patch('/:id', AirplaneController.updateAirplane);

module.exports = router;