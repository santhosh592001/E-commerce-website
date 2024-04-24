//                                            User Order

const CatchAsyncError = require("../MiddleWare/CatchAsyncError");
const Product = require("../Models/ProductsModel")
const Order = require('../Models/ProductOrderModel')
const ErrorHandler = require('../utils/errorHandler')


// Create New Order  --->API LINK ===> /api/v1/New/Order

exports.newOrder = CatchAsyncError(async(req, res, next)=>{

       const {
         
        orderItem,
        shippingInfo,
        itemsPrice,
        taxPrice,
        ShippingPrice,
        totalPrice,
        paymentinfo

       } = req.body

       const orders = await Order.create({

        orderItem,
        shippingInfo,
        itemsPrice,
        taxPrice,
        ShippingPrice,
        totalPrice,
        paymentinfo,
        paidAt: Date.now(),
        user: req.user.id
           
       })

       res.status(200).json({

         success: true,
         message: 'Ordered Successfully',
         orders

       })

})

// Get Single Order -----> API LINK ====> /api/v1/Order/singleProduct/:id

exports.GetSingleOrder = CatchAsyncError(async(req, res, next)=>{

    const order = await Order.findById(req.params.id).populate('user', 'name Email')
           
    if(!order){

      return next(new ErrorHandler(`Order Is Not Found This Id : ${req.params.id}` , 404))

    }

    res.status(200).json({

      success: true,
      order

    })

})

// Get Loggedin User Order  : ===> Note: When The user Ordered  Multiple Order So He/She 
//want to See All order  
// This Function To Getting They Ordered Products to see 

//====> API LINK ===> /api/v1/myorder

exports.MyOrder = CatchAsyncError(async(req, res, next)=>{

const Orders = await Order.find({user: req.user.id});


res.status(200).json({

success:true,
count: Orders.length,
Orders

})

})

//                                  Admin : Get All Orders


// Admin Get all User Orders and than Total Amount

exports.GetAlluserorder = CatchAsyncError(async(req, res, next)=>{

 const order = await Order.find();

   let totalAmount = 0;

    order.forEach(order =>{
       
    totalAmount += order.totalPrice

   })

    res.status(200).json({

      success:true,
      totalAmount,
      Orders: order.length,
      order

    })

   })

   // Admin: Update Order / Order status 

   exports.UpdateOrder = CatchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
  
    if (!order) {
      return next(new ErrorHandler(`Order not found with ID: ${req.params.id}`, 404));
    }
  
    if (order.OrderStatus === "Delivered") {
      return next(new ErrorHandler('Ordered has already been delivered', 400));
    }
  
    // // Log order items before updating stock
    // console.log('Order Items:', order.orderItem);
  
    // Update each order item's stock
    for (const orderItem of order.orderItem) {
      await UpdateStock(orderItem.product, orderItem.quantity); // Use 'product' instead of 'Product'
    }
  
    // Update order status and deliveredAt
    order.OrderStatus = req.body.OrderStatus;
    order.deliveredAt = Date.now();
    await order.save();
  
    res.status(200).json({
      success: true,
    });
  });
  

   async function UpdateStock(ProductId, quantity){

   const Productinstance = await Product.findById(ProductId);

   if (!Productinstance ) {
    throw new ErrorHandler(`Product with ID ${ProductId} not found.`, 404);
  }

  Productinstance.stock =  Productinstance.stock - quantity;
  Productinstance.save({validateBeforeSave:false})

  
   }

   // Admin : Delete Order

  exports.DeleteOrder = CatchAsyncError(async(req, res, next)=>{

    const orders = await Order.findById(req.params.id);

    if(!orders){

      return next(new ErrorHandler(`Order Not Found In this Id: ${req.params.id}`))

    }

    await Order.deleteOne();

    res.status(200).json({

      success: true

    })

  })

  