const express = require('express'); // Import the Express Module
const app = express();  // Create the server
const cors = require('cors')
const errorMiddleware = require("./MiddleWare/error")
const CookieParser = require("cookie-parser")
const bodyParser = require('body-parser')
const getProducts = require('./Models/ProductsModel')
const path = require('path')



app.use(bodyParser.json());

app.use(express.json());  // Create the Middleware for Converting Json file

app.use(CookieParser());  // Create a Middleware For Cookie


app.use(cors());

app.use('/Uploads', express.static(path.join(__dirname, 'Uploads/user')))



// Create a Middlware API link Product To check Postman APi Platform

const products = require('./Routes/Products');   // Import the Routes with Folder and file name

app.use('/api/v1' , products)     // Create a Middleware

//------>

// Get the Products

app.get('/api/v1/Products', (req, res)=>{


    getProducts.find({}, (err, Products)=>{

     if(err){

        console.log(`Error Fetching Products:`, err);
        return res.status(500).json({error: 'Internal server Error'});

     }
     res.json(Products)

    })
})

app.get('/api/v1/Singleproduct/:id', (req, res) => {
    const productId = req.params.id;
    getProducts.findById(productId, (err, Product) => {
      if (err) {
        console.log('Error Fetching Product:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json(Product);
    });
  })



// Create a Middlware API link Authentication To check Postman APi Platform

const Auth = require('./Routes/Authpath')

app.use('/api/v1' , Auth);

//====>


// Create a Middlware API link Authentication To check Postman APi Platform

const Order = require('./Routes/ProductsOrder');
app.use('/api/v1' ,Order)

// Define your route handler for the API endpoint

// Import any necessary modules and models

//====>


app.use(errorMiddleware)  // Create Middleware for whole website Error Handling

module.exports = app;  // export the app to server.js file