// Create the Routers for Products

const express = require('express');
const { 
        getProducts, 
        newProduct, 
        GetSingleproduct, 
        UpdateProduct, 
        DeleteProduct, 
        CreateReviews, 
        GetReviews, 
        DeleteReviews} 

        = require('../Controllers/ProductController');

const router = express.Router();
const {isAuthenticateduser, authorizationRoles} =  require("../MiddleWare/AuthenticatedUser"); // Import the Login form AuthenticatedUser File


router.route("/Products").get(getProducts)  // Get Router
router.route("/Singleproduct/:id").get(GetSingleproduct)// Get Single product Id
router.route("/update/new/:id").put(UpdateProduct)
router.route("/DeleteAll/:id").delete(DeleteProduct)

// Reviews Router
router.route("/Create/Reviews").put(isAuthenticateduser, CreateReviews)
router.route("/GetReviews").get(GetReviews)
router.route("/DeleteReviews").delete(isAuthenticateduser,DeleteReviews)


// Admin Routes Only for Admin ===> Developer Point 

router.route("/Product/new").post(isAuthenticateduser,authorizationRoles('admin'), newProduct) // Post Router



module.exports = router // Export the Router to App.js file