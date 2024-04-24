
//  Create The Product Schema for Product

const mongoose = require("mongoose")  // Import Mongoose

const ProductsSchema  = new mongoose.Schema({

    name : {
          
        type : String,

        required : [true , "Please Enter the Product Name" ],
        trim: true,
        maxLength: [100, "Products Name cannot exceed 100 Character"]
    },

    Price : {

            type : Number,

            required: true,
            default : 0.0

    },

    Description : {
     
        type: String,
        required : [true , "Please Enter the Description"]

    },

    Ratings : {
     
        type: String,
        default : 0

    },

    images : [

           {
             image : {
                       
                type : String,
                required: true
              
             }
           }
    ],

    Catagory: {

        type: String,

        required: [true , "Please Enter the product Catagory"],
        enum : {

           values : [
                  
            "Electronic",
            "Mobile Phone",
            "Laptop",
            "Accessories",
            "HeadPhone",
            "Food",
            "Books",
            "Cloths/Foods",
            "Beauty/Heathy",
            "Sports",
            "Outdoor",
            "Home"

           ],
           message : "Please select correct Catagory"
        }
    },

    seller : {

         type: String,
         required:[true, "Please Enter Product Seller"],
    },

    stock : {
        type: Number,
         required: [true , "Please Enter Products stock"],
         maxLength:[20, "Products stock cannot Exceed 20"]

    },

    NumbersOfReviews : {

               type:Number,
               default: 0
    },

    reviews:[
          
        {
        
            user:{
               type: mongoose.Schema.Types.ObjectId 
            },

            rating:{
                
                type: Number,
                require: true
            },

            comments:{
                
                type:String,
                require: true
            },

        }
    ],

    user: {
     
        type: mongoose.Schema.Types.ObjectId  // Creating Field for Add card User Field step-39 Go to Productcontoller.js

    },

    CreatedAt: {
         
        type: Date,
        default: Date.now()

    }

})

let Schema = mongoose.model("Product" ,ProductsSchema)  // Create the Model for Product schema


module.exports = Schema  // Export the schema to Handler controller in Post Handler function in Productcontroller.js