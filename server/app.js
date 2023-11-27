const { error } = require('console');
const express=require('express')
const path =require('path')
const bcrypt=require('bcrypt')
const nodemailer=require('nodemailer')
const emailValidator=require('email-validator')
const loginCollection=require("./login-data")
const dataname=require("./login-data")


const app=express();
app.set("view engine","ejs");
app.set('views',path.join(__dirname,'../views'))

//path 
 const Homepagepath=path.join(__dirname,'../Homepage');
 const productpagepath=path.join(__dirname,'../products');

 app.use(express.static(Homepagepath))
 app.use(express.static(productpagepath))
 app.use(express.json())
 app.use(express.urlencoded({extended:false}))

 
const port =5000;

//for send mail
const sendVerifyMail = async(name,email,user_id)=>{
    try {
        const transporter = nodemailer.createTransport({
            service:'Gmail',
            // secure:false,
            // requireTLS:true,
            auth:{
                user:'sayanpatra017@gmail.com',
                pass:'yuma nokm eakz qhhm'
            }

        });
        const mailOptions = {
            from:'sayanpatra017@gmail.com',
            to:email,
            subject:'For verification mail',
            html:'<p>Hii '+name+', please click here to <a href="http://127.0.0.1:3080/mailVerify?user='+user_id+'"> Verify </a> your mail. </p> '
        }
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
      return true;   
        
        
    } catch (error) {
        console.error('Failed to send verification email:', error.message);
        return false; 
        
    }

}
// const verifyMail = async(req,res)=>{
//     try {
//        const updateInfo= await loginCollection.updateOne({_id:req.query.id},{ $set:{ is_verified:1 }});
//        console.log(updateInfo);
//        res.send("mail verified");

        
//     } catch (error) {
//         console.log(error.message);
        
//     }
// }


//for homepage
const productdetails = dataname.find({});
app.get('/', async (req, res) => {
  try {
      const data = await productdetails.exec();
      console.log(data); // Check the console for the retrieved data
      res.render("index", { datanames: data });
  } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
  }
});



//for log-in page

app.get('/login' ,(req,res) =>{
    res.render(path.join(Homepagepath,'/login.html'))
    
})
app.get('/signup' , (req,res) =>{




    res.render(path.join(Homepagepath,'/sign_up.html'))
    
})
//entering data in database

app.post('/signup', async (req,res) =>{
    const data={
        name:req.body.name,
        username:req.body.username,
        email:req.body.email,
        is_admin:0,
       
        password:req.body.password
    }
    //replacing password with hashed password
    const saltRounds=10;
    const hashedPassword=await bcrypt.hash(data.password, saltRounds);
    
    data.password=hashedPassword;



//check if the username exixts or not
const validEmail= await loginCollection.findOne({email:data.email})
const existUser=await loginCollection.findOne({username:data.username})
// const id=await loginCollection.findOne({id:data._id})
// console.log(id)

if(existUser ){
   res.send("Username already exists")
    
}else if(!emailValidator.validate(req.body.email)){
    res.send("email is not valid")

}else if(emailValidator.validate(req.body.email) && validEmail){
   
        res.send("email is already in use") 

    

}

else{
     await loginCollection.insertMany([data])
  try {
    
    sendVerifyMail(req.body.name,req.body.email,req.body.username);
    // const updateInfo= await loginCollection.updateOne({username:data.username},{ $set:{ is_verified:1 }});
    // console.log(updateInfo);
    
    
    
  } catch (error) {
    console.log(error.message)
    
  }

    
    

    
   

    
    console.log(data)

}


res.sendFile(path.join(Homepagepath,'/index.html'))


})
//endpoint
app.get('/mailVerify', async (req, res) => {
   
    const username = req.query.user;
    console.log(username)

  
    try {
        res.sendFile(path.join(Homepagepath,'/mailverify.html'))
      // Update user information in the database
      const updateInfo = await loginCollection.updateOne(
        { username },
        { $set: { is_verified: 1 } }
      );
      console.log(updateInfo)
  
      if (updateInfo.modifiedCount > 0) {
        console.log('User information updated:', updateInfo);
      console.log('Mail verified');

      } else {
       return res.status(404).send('User not found or not updated');
      }
    } catch (error) {
      console.error('Error during verification:', error.message);
     return res.status(500).send('Verification failed');
     }
  });



app.post('/login', async (req,res) =>{
   try{
    // console.log("hjasdbhskdgfkd")
    const check= await loginCollection.findOne({username:req.body.username});
    if(!req.body.username){
       return res.send("username can't empty")

    }
    else if(!check){
       return res.send("username not found");
    }

    const isPasswordMatch = await bcrypt.compare(req.body.password , check.password);
    if(isPasswordMatch){
        res.sendFile(path.join(Homepagepath,'/index.html'));
    }else{
       return res.send("wrong password");
    }

    

   }catch{
    res.send("wrong details")
    
   }
    





})
// app.get('/mailVerify',verifyMail);
   


app.get('/products' ,(req,res) =>{
    res.sendFile(path.join(productpagepath,'/specProd.html'))
    
})

app.listen(port,(req,res) =>{
    console.log(`server is running on ${port}`)
})
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500).json(res.error(err.status || 500));
// });
