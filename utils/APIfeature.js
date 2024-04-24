
// Searching Functionality

class ApiFeatures{
      constructor(query, querystr){
          
        this.query = query;
        this.querystr = querystr;

      }


      search(){

          let keyword  =  this.querystr.keyword ? {

            name:{
                
                $regex: this.querystr.keyword,
                $options: 'i'
            }

          }:{};

          this.query.find({...keyword })
          return this;

      }

      //-------> Over Searching Func

      // Filter Catagory Of products
          
      filter(){

        const querystrCopy = {...this.querystr}
            
        // before
        //  console.log(querystrCopy)
        
         // Remove Fields From Query
 
         const removeFields = ['keyword', 'limit', 'page'];
                
         removeFields.forEach(field => delete querystrCopy[field]);
        
        //  console.log(querystrCopy)  
        
        
        // Filter Price
        
        let querystr = JSON.stringify(querystrCopy);

      querystr = querystr.replace(/\b(gt|gte|It|Ite)/g, match => `$${match}`)
      
      
      // this.query.find(JSON.parse(querystr));

      
        return this;
 
        }

        // Pagination Page Function
       
        paginate(resPerPage){
        
         const currentPage = Number(this.querystr.page) || 1;

        const skip = resPerPage *  (currentPage - 1);

        this.query.limit(resPerPage).skip(skip);
           
        return this;
        }


}

      


module.exports = ApiFeatures  // Export the ApiFeatures to ProductController.js file