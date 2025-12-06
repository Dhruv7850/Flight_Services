const {StatusCodes} = require('http-status-codes');

function validateCreateRequest(req,res,next){
    if(!req.body || !req.body.modelNumber ){
        return res  
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    success: false,
                    message: "Something went wrong while validating request",
                    data: {},
                    error: {
                    explanation: "Model Number not found in incoming request"
                }
                })
    }
    //controller will be the next middleware
    next();
}

module.exports = {
    validateCreateRequest
}