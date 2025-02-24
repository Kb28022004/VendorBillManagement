

class ApiFeature{
    constructor(query,queryString){
        this.query=query;
        this.queryString=queryString
    }

    search(){
        const keyword=this.queryString.keyword ? {name:{$regex:this.queryString.keyword,$options:"i"}}:{}
        this.query=this.query.find({...keyword})
        return this
    }

    filter() {
        const queryCopy = { ...this.queryString };
    
        // Remove fields not intended for filtering
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach((key) => delete queryCopy[key]);
    
        // Advanced filtering
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
      } 

    pagination(resultPerPage){
        const currentPage=Number(this.queryString.page) || 1
        const skip=resultPerPage*(currentPage-1)
        this.query=this.query.skip(skip).limit(resultPerPage)
        return this;
    }
}

module.exports=ApiFeature