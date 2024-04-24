
//  Handler Function 

const Product = require("../Models/ProductsModel") // Import the Folder and file name of Models and ProductsModel
const ErrorHandler = require("../utils/errorHandler")
const CatchAsyncError = require("../MiddleWare/CatchAsyncError") // It Anonomouse MiddleWare promise file
const ApiFeatures = require("../utils/APIfeature")

//Get Product   -----> /api/v1/products ----> API URL

exports.getProducts = CatchAsyncError(async (req, res, next) =>{

    const resPerPage = 13;

    let filter = {};

    // Check if price range parameters are provided in the request query
    if (req.query.minPrice && req.query.maxPrice) {
      filter.price = { $gte: req.query.minPrice, $lte: req.query.maxPrice };
    }
    
    const apiFeatures =  new ApiFeatures(Product.find(), req.query).search().filter().paginate(resPerPage)

    const Products =  await apiFeatures.query;   // By using Find() to Get All the Products
  
    const totalproductsCount = await Product.countDocuments({})

    // Loading the Server

    //await new //Promise(resolve => setTimeout(resolve, 3000))
    
    res.status(200).json({

           success: true,
           Count : totalproductsCount,
           resPerPage,                                                      
           Products    

    })

})


// Create Product - /api/v1/Product/new --> API URL

exports.newProduct = CatchAsyncError(async (req, res, next) =>  {
        
       req.body.user = req.user.id; // By using The Cookies req.user to get all user data and set to req.body  
              
        const newProduct = await Product.create(req.body);
        res.status(201).json({                                    // Error Point
          
           success : true,
           Product : newProduct

        });

    })

// Get Single Products  ---> /api/v1/Singleproduct/id

exports.GetSingleproduct = CatchAsyncError(async (req, res, next) => {

   
        const getProduct = await Product.findById(req.params.id);

        if(!getProduct){
              
          return next(new ErrorHandler('Product Not Found' ,400))
        
        }
  
        res.status(200).json({
  
          success: true,
          Product : getProduct   // error Point
  
        })

})

//Update Product  ---> /api/v1/update/new/id

exports.UpdateProduct = async (req, res, next) =>{

         
        const ProductToUpdate = await Product.findById(req.params.id);
        
        if(!ProductToUpdate){
            
            return next(new ErrorHandler('Product Not Found' ,400))
            
        }

        UpdatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
               
            new : true,                         // <==============  error Point
            runValidators: true
             
        })


        res.status(200).json({
          
            success: true,
            UpdatedProduct : UpdatedProduct

        })
}

// Delete Product   /api/v1/DeleteAll/ ===> API URL

exports.DeleteProduct = async (req, res, next) => {

    try{

 const ProductTodelete = await Product.findById(req.params.id);

 if(!ProductTodelete){

    res.status(404).json({

        success : false,
        message: "Not Found"

    })

 }

  await Product.deleteOne({ _id: req.params.id})  // error Point
        
 res.status(200).json({

success: true,
message: "Product Deleted"

 })

} catch(error){
  
    res.status(500).json({

        success: false,
        message: "Failed to Delete",
        error: error.message

    })


}

}

//                                     Review API Services

  // Create Reviews  ===> API LINK ==> /api/v1//Create/Reviews

  exports.CreateReviews = CatchAsyncError(async(req, res, next)=>{

    const {ProductId, rating, comments} = req.body;   // Destructing the Reviews Id, rating, comments

    const review = {
         
      user:  req.user.id,      // <------ Creating a new Review Object
      rating,
      comments

    }


// When a User Buy the Products means so the unique Id will 
//provide for each user So now we the Getting that Id for Reviews purpose

// Checking the User Reviewed Or Not by Comparing the Product Buys id and Login Id

// Finding user Review exists

    const product = await Product.findById(ProductId);
   const isReviewed = product.reviews.find( review =>{
       
   return review.user.toString() == req.user.id.toString()

    })


    if(isReviewed){
      
      // Updating the Review

      product.reviews.forEach(review =>{
          
        if(review.user.toString() == req.user.id.toString()){
                                                            
            review.comments =comments
            review.rating = rating

        }

      })

   
       
    }else{

        // Creating the Reviews

      product.reviews.push(review)
      product.NumbersOfReviews = product.reviews.length  // Create a Number of Reviews length

    }

    // Finding the Average of the product Reviews

    product.Ratings = product.reviews.reduce((acc, reviews)=>{
  
          return reviews.rating + acc;

    },0) / product.reviews.length;

    product.Ratings = isNaN(product.Ratings)?0:product.Ratings
    

    // Saving the product

    product.save({validateBeforeSave:false})

    res.status(200).json({

      success:true

    })


})

// Get User Reviews  ===> API LINK ==> /api/v1/GetReviews

exports.GetReviews = CatchAsyncError(async(req, res, next)=>{

  const product = await Product.findById(req.query.id);

  res.status(200).json({

    success: true,
    Reviews: product.reviews

  })

})

// Delete Reviews ===> API LINK ==> /api/v1/DeleteReviews

exports.DeleteReviews = CatchAsyncError(async (req, res, next) => {
    const productId = req.query.ProductId;
    const reviewIdToDelete = req.query.id;

    const product = await Product.findById(productId);

    // Filter out the review to delete
    const updatedReviews = product.reviews.filter(review => 
        review._id.toString() !== reviewIdToDelete.toString());
        

    // Update the number of reviews
    const NumberOfReviews = updatedReviews.length;

    // Calculate the new average rating
    let Ratings = 0;
    if (NumberOfReviews > 0) {
        Ratings = updatedReviews.reduce((acc, review) => acc + review.rating, 0) / NumberOfReviews;
    }

    // Handle NaN case explicitly
    Ratings = isNaN(Ratings) ? 0 : Ratings;

    await Product.findByIdAndUpdate(productId, {
        reviews: updatedReviews,
        NumbersOfReviews: NumberOfReviews,
        Ratings
    });

    res.status(200).json({
        success: true
    });
});
