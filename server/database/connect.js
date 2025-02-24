const mongoose=require('mongoose')
mongoose.set('strictQuery', true); // Explicitly enable strict query casting


const ConnectDB=(url)=>{
    
return mongoose.connect(url)
}


module.exports=ConnectDB