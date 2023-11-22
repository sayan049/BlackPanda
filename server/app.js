const { error } = require('console');
const express=require('express')
const path =require('path')
const loginCollection=require("./login-data")


const app=express();

//path 
 const Homepagepath=path.join(__dirname,'../Homepage');
 const productpagepath=path.join(__dirname,'../products');

 app.use(express.static(Homepagepath))
 app.use(express.static(productpagepath))
 app.use(express.json())
 app.use(express.urlencoded({extended:false}))

 
const port =8080;


//for homepage

app.get('/',(req,res)=>{
    res.sendFile(path.join(Homepagepath,'/index.html'))
})

//for log-in page

app.get('/login' ,(req,res) =>{
    res.render(path.join(Homepagepath,'/login.html'))
    
})
app.get('/signup' , (req,res) =>{




    res.render(path.join(Homepagepath,'/sign_up.html'))
    
})

app.post('/signup', async (req,res) =>{
    const data={
        name:req.body.name,
        email:req.body.email,
        number:req.body.number,
        password:req.body.password
    }

await loginCollection.insertMany([data])
res.sendFile(path.join(Homepagepath,'/index.html'))
console.log(data)

})
app.post('/login', async (req,res) =>{
   try{
    // console.log("hjasdbhskdgfkd")
    const check= await loginCollection.findOne({name:req.body.name})

    if( check.password===req.body.password  ){
        res.sendFile(path.join(Homepagepath,'/index.html'))
    }
    
    else{
        res.send("wrong details")
    }

   }catch{
    res.send("wrong ")
    
   }
    





})

app.get('/products' ,(req,res) =>{
    res.sendFile(path.join(productpagepath,'/specProd.html'))
    
})

app.listen(port,(req,res) =>{
    console.log(`server is running on ${port}`)
})