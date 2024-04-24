const Products = require("../Data/Products.json")   // Importing  Data folder and Products.json Module"
const product = require("../Models/ProductsModel")  // Importing Models folder and productsModel file Module
const dotenv = require("dotenv")                    // Import dotenv  Module
const Connectdatabase = require('../configure/Database')    


dotenv.config({path : "configure/configure.env"});  // Create the Envirnoment path

Connectdatabase()   // Call the Database to connect




const seedProduct = async () => {
   
    try{
  
        await product.deleteMany();
        console.log('Products Deleted!')
        await product.insertMany(Products)
        console.log("All Products Added")

    }catch(error){

    console.log(error.message);

    }
    process.exit();  // Exit the process

}

seedProduct()  // Call the function