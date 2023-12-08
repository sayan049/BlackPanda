const mongoose=require("mongoose")
// const mongoUrl="mongodb+srv://sayan049:YBAnsRI4EcsOalps@cluster0.5ynm4va.mongodb.net/login-data?retryWrites=true&w=majority"
const mongoUrl="mongodb+srv://BlackPanda:4D5w06JRL9FjIgOE@blacpandacluster.oodizbz.mongodb.net/BlackPanda?retryWrites=true&w=majority"

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
const loginCollection= new mongoose.model("loginCollection",loginSchema)

// module.exports=loginCollection

const productSchema=new mongoose.Schema({
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
        },
        Gender:{
            type:String
        }
})





const dataname=new mongoose.model('productCollection',productSchema);
 //module.exports=dataname;
 module.exports={
    loginCollection: loginCollection,
    dataname: dataname
 };
