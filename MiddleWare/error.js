
//  Create the Middleware

 module.exports = (err, req, res, next) => {

    err.statusCode =  err.statusCode || 500;
         

           // Create the Environental setup
              
    
        if(process.env.NODE_ENV == 'development'){

          res.status(err.statusCode).json({

            success: false,
            message: err.message,
            stack : err.stack,
            error: err
  
        })

        }

        
        if(process.env.NODE_ENV == 'production'){
            
          let message = err.message;
          let error = new Error(message)   // Fixing Error


          // Validation error

          if(err.name == "ValidationError"){

               message = Object.values(err.errors).map(value => value.message)
               error = new Error(message)
               err.statusCode = 400
          }

          // Handling Cast Error

          if(err.name == "CastError"){

             message = `Resource Not Found:${err.path}`
             error = new Error(message)
             err.statusCode = 400
          }

          // Error Handling user Api services 
               
          // 1. Duplicate Key Error 

          if(err.code == 11000){
             
            let message = `Dulicate ${Object.keys(err.keyValue)} error` 
            error = new Error(message)
            err.statusCode = 400
          }

          // 2. JsonWebToken Error

          if(err.name == 'JSONWebTokenError'){

            let message = `JSON Web Token is Invalid. Try Again`
            error = new Error(message)
            err.statusCode = 400
          }

          // 3.TokenExpired Error

          if(err.name == 'TokenExpiredError'){

            let message = `JSON web Token is Expired. Try Again`
            error = new Error(message)
            err.statusCode = 400
          }


          
          res.status(err.statusCode).json({

            success: false,
            message: error.message || "Internal server error",

        })

        }
    

}

