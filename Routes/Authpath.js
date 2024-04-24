
const express = require('express');
const multer = require('multer');
const path = require('path')

const Upload = multer({storage: multer.diskStorage({
    
    destination: function(req, file, cb){

        cb(null, path.join( __dirname,'..' ,'Uploads/user'))

    },

    filename: function(req, file, cb){

        cb(null, file.originalname)

    }


})})



const { 

        registerUser, 
        loginUser, 
        LogOut, 
        ForgotPassword, 
        ResetPassword, 
        GetUserProfile, 
        ChangePassword, 
        UpdateProfile,
        GetAlluser,
        Getsingaluser,
        UpdateUser,
        DeleteUser,
        

    } = require('../Controllers/AuthenticateController');
const router = express.Router();
const {isAuthenticateduser, authorizationRoles} = require('../MiddleWare/AuthenticatedUser')


router.route("/UserRegister").post(Upload.single('avatar') ,registerUser)
router.route("/login").post(loginUser);
router.route("/logout").get(LogOut);
router.route("/password/Forgot").post(ForgotPassword)
router.route("/password/reset/:token").post(ResetPassword)
router.route("/MyProfile").get(isAuthenticateduser,GetUserProfile)
router.route("/Password/change").put(isAuthenticateduser,ChangePassword)
router.route("/UpdateProfile").put(isAuthenticateduser, UpdateProfile)


// Admin Routes ==== > FOR Developers Role of this section to check and Contols the Website

router.route("/Admin/user").get(isAuthenticateduser , authorizationRoles('admin'),GetAlluser)
router.route("/Admin/user/:id").get(isAuthenticateduser , authorizationRoles('admin'),Getsingaluser)
                               .put(isAuthenticateduser , authorizationRoles('admin'),UpdateUser)
                               .delete(isAuthenticateduser , authorizationRoles('admin'),DeleteUser)


module.exports = router;