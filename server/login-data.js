const mongoose=require("mongoose")
// const mongoUrl="mongodb+srv://sayan049:YBAnsRI4EcsOalps@cluster0.5ynm4va.mongodb.net/login-data?retryWrites=true&w=majority"
const mongoUrl="mongodb+srv://sayan049:wiKENYaWR7tbM5YI@cluster0.5ynm4va.mongodb.net/login-data?retryWrites=true&w=majority"

const connectionsParams={
    useNewUrlParser:true,
    useUnifiedTopology:true
};

mongoose.connect(mongoUrl).then( () => {
    console.log("Mongo Connected bitch");
}).catch(() =>{
    console.log("Failed to connect bhadwa");
})


const loginSchema= new mongoose.Schema({
    name:{
        type:String,
        // required:true
    },
    username:{
        type:String,
       required:true
    },
    email:{
        type:String,
        // required:true
        
    },
    

    password:{
        type:String,
        required:true
    },
    is_admin:{
        type:String,
        required:true
    },
    is_verified:{
        type:String,
        default:0
    }
   

})

const productSchema=new mongoose.Schema({
    id:{
        type:Number
    },
    link:{
        type:String

        },
        ImageLink:{
            type:String
        },
        category:{
            type:Array
        },
        price:{
            type:String
        }
})



const loginCollection= new mongoose.model("loginCollection",loginSchema)

module.exports=loginCollection

const dataname=new mongoose.model('productdCollection',productSchema);
module.exports=dataname;
