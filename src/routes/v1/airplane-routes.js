const express = require('express')
const router = express.Router();

const {AirplaneController} = require('../../controller')




// /api/v1/airplane POST
router.post('/', AirplaneController.createAirplane);

module.exports = router;