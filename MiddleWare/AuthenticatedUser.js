
// create the Security for Products router Authentication Middleware

const ErrorHandler = require("../utils/errorHandler");
const User = require("../Models/UserModel")
const CatchAsyncError = require("./CatchAsyncError");
const jwt = require('jsonwebtoken')
 
// Setup the Cookies

exports.isAuthenticateduser = CatchAsyncError( async (req, res, next)=>{

 const { token } = req.cookies    // Getting the Cookies and Token

     
 if(!token){

 return next(new ErrorHandler("Login First to handle this Resourses", 401))

 }

 // Decoding the Generate web token

 const decode = jwt.verify(token, process.env.GWT_SECRET )
   req.user = await User.findById(decode.id)
   next();  // Call the Next middleware 

})

// when cookies want to get an object in Req means we could Create cookies middleware -- 
//so Install Cookie parser
// Install Cookie parser Package in Package.Json
// Website Name: Cookie parser


// Authorize User Roles && Permission
 
exports.authorizationRoles = (...roles)=>{

   return (req, res, next)=>{

   if(!roles.includes(req.user.role)){
      
    return next(new ErrorHandler(`The Role of ${req.user.role} is not Allowed` , 401));

   }
   next()

   }

}