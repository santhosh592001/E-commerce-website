
  // Promise Anonomouse Error Middleware

module.exports = func => (req, res, next)=>
    Promise.resolve(func(req, res, next)).catch(next)


    //After Finishing this Field Import the file at ProductController.js file