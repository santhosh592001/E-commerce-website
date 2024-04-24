
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const crypto = require('crypto');



const userSchema = new mongoose.Schema({

 name:{
    
    type: String,
    required : [true , "Please Enter The Name"]

 },

 Email:{
    
    type: String,
    required : [true , "Please Enter The E-mail"],
    unique: true,
    validate :[validator.isEmail, "Please Enter the Vaild E-mail Address"]

 },

 password : {

       type: String,
       required: [true, 'Please Enter Passward'],
       maxlength: [6, 'Passward Cannot exceed 6 characters'],
       select : false
 },

 Profile: {

    type: String

 },

 role:{
         
    type:String,
    default: 'user'

 },



 resetPasswordToken: String,
 resetPasswordTokenExpire: Date,



 Createat :{

    type: Date,

    default: Date.now()

 }


})

// create the Hash password Function Register password for secerity purpose 

userSchema.pre('save', async function (next) {
   if (!this.isModified('password')) {
       return next();                                    // Error Point
   }

   if (!this.password) {
       return next(new Error('Password is required.'));
   }

   this.password = await bcrypt.hash(this.password, 10);
   next();
});


// Generate web token function Create and calling this funtion to Authentionuser.js file

userSchema.methods.Generate = function(){

 return jwt.sign({id: this.id}, process.env.GWT_SECRET, {
       
      expiresIn: process.env.GWT_EXPIRES_TIME

   })

}

// Login Form user Function to Encrypted

userSchema.methods.isValidPassword = async function(Enterpassword){
 
return await bcrypt.compare(Enterpassword , this.password)

}

// Creating the User Reset Password-- > So we could Generate token for reset password
// INSTALL npm package in backend ---->  npm install crypto

userSchema.methods.getResetToken = function(){
    
   // Generate Token
   const token = crypto.randomBytes(8).toString('hex');
   
   // Generate Hash and set to resetPasswordToken

   this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

   // set Token expire Time

   this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000

   return token;  // After complete this file Go to the AuthenticationController.js file to Create Handler function
}


let UserModel = mongoose.model('User' ,userSchema)

module.exports = UserModel;