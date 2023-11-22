const mongoose=require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/login_data").then( () => {
    console.log("Mongo Connected bitch");
}).catch(() =>{
    console.log("Failed to connect bhadwa");
})


const loginSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        // required:true
        
    },
    number:{
        type:Number,
       // required:true
    },

    password:{
        type:String,
        required:true
    },
   

})


const loginCollection= new mongoose.model("loginCollection",loginSchema)

module.exports=loginCollection
