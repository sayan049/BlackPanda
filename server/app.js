const { error } = require('console');
const express=require('express')
const path =require('path')


const app=express();

//path 
 const Homepagepath=path.join(__dirname,'../Homepage');
 const productpagepath=path.join(__dirname,'../products');

 app.use(express.static(Homepagepath))
 app.use(express.static(productpagepath))

 
const port =5000;


//for homepage

app.get('/',(req,res)=>{
    res.sendFile(path.join(Homepagepath,'/index.html'))
})

//for log-in page

app.get('/login' ,(req,res) =>{
    res.sendFile(path.join(Homepagepath,'/login.html'))
    
})

app.get('/products' ,(req,res) =>{
    res.sendFile(path.join(productpagepath,'/specProd.html'))
    
})

app.listen(port,(req,res) =>{
    console.log(`server is running on ${port}`)
})