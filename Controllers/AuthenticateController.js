
// Maintain all User Handler control function In this File  ---> AuthenticateController.js
//  Create a Register and Login Form Authentication & APIs

const CatchAsyncError = require("../MiddleWare/CatchAsyncError")
const User = require("../Models/UserModel")
const SendEmail = require("../utils/Email")
const ErrorHandler = require("../utils/errorHandler")
const sendToken = require("../utils/jwt")  // Import the Generate web Token File
const Crypto = require("crypto")


// Register User  ---> API services link =  /api/v1/UserRegister

exports.registerUser = CatchAsyncError(async (req, res, next) => {

  const { name, Email, password} = req.body;

  let Profile;

  if(req.file){
   
    Profile = `${process.env.BACKEND_URL}/Uploads/user/${req.file.originalname}`
    
  }
  

  const user = await User.create({

    name,
    Email,
    password,
    Profile

  });


  sendToken(user, 201, res);

})


// Login User  API LINK ====>   /api/v1/login

exports.loginUser = CatchAsyncError(async (req, res, next) => {

  const { Email, password } = req.body

  if (!Email || !password) {


    return next(new ErrorHandler('Please Enter email & password', 400))


  }


  // Finding the user Database

  const user = await User.findOne({ Email }).select('+password')  // <----- Retriving data from database

  // After check the database email & password data is valid  or not 

  if (!user) {

    return next(new ErrorHandler('Invalid email && Password', 401))

  }


  // Match the Password UserPassword and Database password  Already Logined Saved password

  if (!await user.isValidPassword(password)) {

    return next(new ErrorHandler('Invalid email && Password', 401))

  }

  sendToken(user, 201, res);  //Import the Generate Web Token function

})


// LogOut User ===> API Link ===> /api/v1/logout

exports.LogOut = (req, res, next) => {

  res.cookie('token', null, {

    expires: new Date(Date.now()),
    httpOnly: true

  }).status(200).json({

    success: true,
    Message: "Loggedout"  // Next Create the Router for this Logout in Authpath.js file

  })

}


// Create Handler function 
//Forgot Password === > API LINK ===> /api/v1/password/Forgot

exports.ForgotPassword = CatchAsyncError(async (req, res, next) => {

  const user = await User.findOne({ Email: req.body.Email })

  if (!user) {

    return next(new ErrorHandler("User Not Found This Email", 404))

  }

  // Getting Reset Token password

  const resetToken = user.getResetToken();

  // Save the resetPasswordToken && resetPasswordTokenExpire and don't validate

  await user.save({ validateBeforeSave: false })

  //Create a Reset URl 

  const resetUrl = `${req.protocal}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

  // Create an email message for user

  const message = `Your Password Reset Url as Follows \n\n 
${resetUrl}\n\n If You Have not Requested this email, then Ignored It`;

  try {

    SendEmail({

      Email: user.Email,
      subject: "Santhosh kuamr reset",
      message

    })

    res.status(200).json({

      success: true,
      message: `Email sent  to ${user.Email}`

    })

  } catch (error) {

    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message), 500)
  }

})

//Create an handler Resetpassword function  Note : Import the Crypto Package in top of the file

// Reset Password ===> API LINK ===> /api/v1/password/reset/:token

exports.ResetPassword = CatchAsyncError(async (req, res, next) => {

  const resetPasswordToken = Crypto.createHash('sha256').update(req.params.token).digest('hex');

  // Retriving the User Data

  const user = await User.findOne({

    resetPasswordToken,
    resetPasswordTokenExpire: {

      $gt: Date.now()   //NOTE : THE expire time should be greater than current time

    }

  })

  if (!user) {

    return next(new ErrorHandler('Password Reset Token is Invalid Or Expired'))

  }

  // Matching the Reset Password and Confirm password

  if (req.body.password !== req.body.confirmPassword) {

    return next(new ErrorHandler('Password Does Not Match'))

  }

  // validate

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpire = undefined;
  await user.save({ validateBeforeSave: false })

  sendToken(user, 201, res);

})


//                   User Profile ,Order  &&  Reviews API services



// Get User Profile ===> API LINK ====> /api/v1/MyProfile

exports.GetUserProfile = CatchAsyncError(async (req, res, next) => {

  const user = await User.findById(req.user.id)

  res.status(200).json({

    success: true,
    user

  })

})



// Change Password  ===> API LINK ===> /api/v1//Password/change

exports.ChangePassword = CatchAsyncError(async (req, res, next) => {

  const user = await User.findById(req.user.id).select('+password')


  // Check Old Password

  if(!await user.isValidPassword(req.body.oldPassword)) {

    return next(new ErrorHandler('Old Password is Incorrect', 401))

  }

  // Assinging New Password

  user.password = req.body.password;
  await user.save();

  res.status(200).json({

    success: true,

  })

})


// Update Profile

exports.UpdateProfile = CatchAsyncError(async(req, res, next)=>{

  const newUserData = {
    
    name: req.body.name,
    Email: req.body.Email

  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {

    new: true,
    runValidators:true,  // <=== Error Handler


  })

  res.status(200).json({
      
    success: true,
    user
  
  })

})                                     


// ADMIN : Get User All 

// Get User  ==> API Link ===> /api/v1/Admin/user

exports.GetAlluser = CatchAsyncError(async(req, res, next)=>{

const users = await User.find();

res.status(200).json({

success: true,
users

})

})

// ADMIN: GET specified User     APL LINK ===> /Admin/user/:id

exports.Getsingaluser = CatchAsyncError(async (req, res , next)=>{

const user = await User.findById(req.params.id)

if(!user){

  return next(new ErrorHandler(`User Not Found in This Id : ${req.params.id}`))

}

res.status(200).json({
success : true,
user

})

})


// ADMIN : Update User      APL LINK ===> /Admin/user/:id

exports.UpdateUser = CatchAsyncError(async(req, res, next)=>{

  const newUserData = {
    
    name: req.body.name,
    Email: req.body.Email,
    role: req.body.role

  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {

    new: true,
    runValidators:true,  // <=== Error Handler


  })

  res.status(200).json({
      
    success: true,
    user
  
  })
 

})

// ADMIN : Delete User      APL LINK ===> /Admin/user/:id

exports.DeleteUser = CatchAsyncError(async(req, res, next)=>{

 const user = await User.findById(req.params.id);

 if(!user){

  return next(new ErrorHandler(`User Admain Deleted paramentely in this Id : ${req.params.id}`))

 }

 await user.deleteOne();  // Delete Admain

 res.status(200).json({

  success: true,

 })

})

