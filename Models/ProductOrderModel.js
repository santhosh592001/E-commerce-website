
const mongoose = require('mongoose')

const orderSchema =  mongoose.Schema({

shippingInfo: {

          address:{

             type: String,
             required: true

          },

          country:{

            type: String,
            required: true

         },

         city:{

            type: String,
            required: true

         },

         phoneNo:{

            type: Number,
            required: true

         },

         postalCode:{

            type:Number,
            required: true

         },

},

user:{

type: mongoose.SchemaTypes.ObjectId,
required:true,
ref:'User'

},

orderItem:[{
  
    name: {
        
        type: String,
        required: true,

    },
    quantity: {
        
        type: Number,
        required: true,

    },
    image: {
        
        type: String,
        required: true,

    },
    price: {
        
        type: Number,
        required: true,

    },
    product: {
        
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'product'

    },
}],

itemsPrice:{

    type:Number,
    required: true,
    default:0.0
},

taxPrice:{
  
    type:Number,
    required:true,
    default:0.0
},

ShippingPrice:{

    type:Number,
    required:true,
    default:0.0

},

totalPrice:{

type: Number,
required:true,
default:0.0

},

paidAt:{

    type:Date

},

deliveredAt:{

type: Date

},

OrderStatus:{

    type:String,
    required:true,
    default: "processing"


},

CreatedAt:{

    type: Date,
    default:Date.now
}

})

let OrderModel = mongoose.model('Order' , orderSchema)

module.exports = OrderModel;