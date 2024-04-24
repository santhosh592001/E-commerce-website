const app = require('./app')
const dotenv = require('dotenv')
const path = require('path')
const Connectdatabase = require('./configure/Database')



dotenv.config({path:path.join(__dirname,"configure/configure.env")})

Connectdatabase()

const server = app.listen(process.env.PORT,()=>{

console.log(`server listening to port ${process.env.PORT} in ${process.env.NODE_ENV}`)

})





// UnHandledRejection Error ===> When Mongodb Database not connected means or The promise catch 
//error not catched the error This error will shown

process.on('unhandledRejection' , (err)=>{

    console.log(`Error: ${err.message}`);
    console.log("Shutting Down the server due to the Unhandled Rejection error");
    server.close(()=>{
   
        process.exit(1);

    })

})

// UnCaughtException Error  ---> When  the Value Not Defined means this error will show

process.on('uncaughtException' , (err)=>{

    console.log(`Error: ${err.message}`);
    console.log("Shutting Down the server due to the Uncaught Exception error");
    server.close(()=>{
   
        process.exit(1);

    })
})

// Console.log(a)  