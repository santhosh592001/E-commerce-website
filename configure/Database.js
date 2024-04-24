
// Create a Database connection

const mongoose = require('mongoose');

const Connectdatabase = () => {

mongoose.connect(process.env.MONGO_URL, {
  
    // useNewUrlParser : true,
    // useUnifiedTopology: true

}).then(con=>{

console.log(`Mongodb is connected to the Host: ${con.connection.host}`)

})   //   <----- UnhandleRejection error Point


}

module.exports = Connectdatabase  // Export the Database to server.js