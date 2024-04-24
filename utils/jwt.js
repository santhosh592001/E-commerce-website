  
  // Generate A web token for Login User

const sendToken = (user, statuscode, res) =>{

 
// Setting Cookies  // Note : After 7 days Ago  this cookies will automatically Removed A javascript Cannot 
// Access this Cookies

const Options = {
  
  expires : new Date(Date.now() + process.env.Cookies_EXPIRES_TIME * 24 * 60 * 60 * 1000
  
  ),
  httpOnly: true,

}


//Creating the Token
 
const token = user.Generate();


res.status(statuscode).cookie('token' ,token ,Options).json({    // Create the status for cookies and this status is used for

    success: true,                                      //Generate Token
    token,
    user
})


}

module.exports = sendToken;