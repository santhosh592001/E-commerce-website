const express = require('express');
const { newOrder, GetSingleOrder, MyOrder, GetAlluserorder, UpdateOrder, DeleteOrder } = require('../Controllers/ProductsOrderController');
const router = express.Router();
const {isAuthenticateduser, authorizationRoles} = require('../MiddleWare/AuthenticatedUser')

// User Orders

router.route('/New/Order').post(isAuthenticateduser,newOrder)
router.route('/Order/singleProduct/:id').get(isAuthenticateduser,GetSingleOrder)
router.route('/myorder').get(isAuthenticateduser,MyOrder)


// Admin Get All User Orders Only Admin can Access  ===> Developer Point

router.route('/Admin/GetAllUserOrder').get(isAuthenticateduser,authorizationRoles('admin'),GetAlluserorder)
router.route('/Admin/UpdateOrder/:id').put(isAuthenticateduser,authorizationRoles('admin'),UpdateOrder)
router.route('/Admin/Deleteorder/:id').delete(isAuthenticateduser,authorizationRoles('admin'),DeleteOrder)


module.exports = router;