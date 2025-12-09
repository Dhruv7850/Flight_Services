const express = require('express')
const router = express.Router();

const {CityController} = require('../../controller')

router.post('/', 
    CityController.createCity,  
);
// /api/v1/airplane POST

module.exports = router;