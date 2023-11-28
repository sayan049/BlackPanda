const { error } = require('console');
const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const emailValidator = require('email-validator')
const sendResetPasswordLink=require('./forgot-resetPassword');
const { loginCollection, dataname } = require('./login-data');





//path 
const Homepagepath = path.join(__dirname, '../Homepage');
const productpagepath = path.join(__dirname, '../products');
const ejsEnginePath = path.join(__dirname, '../views');



//Routes
const app = express();
app.use(express.static(Homepagepath))
app.use(express.static(productpagepath))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '../views'))



//port
const port = 3080;

//for send mail
const sendVerifyMail = async (name, email, user_id) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'sayanpatra017@gmail.com',
        pass: 'yuma nokm eakz qhhm'
      }

    });
    const mailOptions = {
      from: 'sayanpatra017@gmail.com',
      to: email,
      subject: 'For verification mail',
      html: '<p>Hii ' + name + ', please click here to <a href="http://127.0.0.1:3080/mailVerify?user=' + user_id + '"> Verify </a> your mail. </p> '
    }
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return true;
  } catch (error) {
    console.error('Failed to send verification email:', error.message);
    return false;
  }
}




//middleware for html showing
const fetchDataMiddleware = async (req, res, next) => {
  try {
    const datas = await dataname.find({}).exec();
    req.datas = datas;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};


app.use(fetchDataMiddleware);






// const productdetails = dataname.find({});
app.get('/', async (req, res) => {
  try {
    // let datas = await productdetails.exec();
    // console.log(datas); // Check the console for the retrieved data
    res.render("index", { datanames: req.datas });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//reseting password variable
let userforResetPassword ;

//for log-in page

app.get('/login', (req, res) => {
  res.render('login')

})
app.get('/signup', (req, res) => {
  res.render('sign_up')
})
app.get('/products', (req, res) => {
  res.render('specProd')

})
app.get('/resetPassword', async(req, res)=>{
  res.render('resetPassword')
   userforResetPassword=req.query.user;
  // console.log(userforResetPassword);
})





//entering data in database

app.post('/signup', async (req, res) => {
  const data = {
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    is_admin: 0,

    password: req.body.password
  }
  //replacing password with hashed password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(data.password, saltRounds);

  data.password = hashedPassword;



  //check if the username exixts or not
  const validEmail = await loginCollection.findOne({ email: data.email })
  const existUser = await loginCollection.findOne({ username: data.username })
  // const id=await loginCollection.findOne({id:data._id})
  // console.log(id)

  if (existUser) {
    res.send("Username already exists")

  } else if (!emailValidator.validate(req.body.email)) {
    res.send("email is not valid")

  } else if (emailValidator.validate(req.body.email) && validEmail) {

    res.send("email is already in use")
  }
  else {
    try {
      await loginCollection.insertMany([data]);
      console.log(data)
      sendVerifyMail(req.body.name, req.body.email, req.body.username);
      // const updateInfo= await loginCollection.updateOne({username:data.username},{ $set:{ is_verified:1 }});
      // console.log(updateInfo);
      // let datas = await productdetails.exec();
      res.render("index", { datanames: req.datas });
    } catch (error) {
      console.log(error.message)

    }
  }
})




//endpoint
app.get('/mailVerify', async (req, res) => {
  res.render('mailVerify')
  const username = req.query.user;
  console.log(username)
  try {

    // Update user information in the database
    const updateInfo = await loginCollection.updateOne(
      { username },
      { $set: { is_verified: 1 } }
    );
    if (updateInfo.modifiedCount > 0) {
      // console.log('User information updated:', updateInfo);
      console.log('Mail verified');

    } else {
      return res.status(404).send('User not found or not updated');
    }
  } catch (error) {
    console.error('Error during verification:', error.message);
    return res.status(500).send('Verification failed');
  }
});




//signin page
app.post('/login', async (req, res) => {
  try {
    // console.log("hjasdbhskdgfkd")
    const check = await loginCollection.findOne({ username: req.body.username });
    if (!req.body.username) {
      return res.send("username can't empty")

    }
    else if (!check) {
      return res.send("username not found");
    }

    const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
    if (isPasswordMatch) {
      res.render('index', { datanames: req.datas })
    } else {
      return res.send("wrong password");
    }
  } catch {
    res.send("wrong details")

  }
})


//forgot password post method

app.post('/forgotPassword', async (req,res) => {
  try {
    const mail=req.body.email;
  const findEmail=await loginCollection.findOne({email:mail});
  // const verifiedEmail=await loginCollection.findOne({email:findEmail.is_verified : 1})
  console.log(findEmail.is_verified);

  if(!mail){
   return res.json("mail not valid");
  }else if(emailValidator.validate(mail) && !findEmail){
    return res.send("email not found");
  }else if(emailValidator.validate(mail) && findEmail && findEmail.is_verified == 1){
    sendResetPasswordLink(findEmail.name,findEmail.username,mail);
    res.send("email sent")

  }else{
    res.send("Email is not verified yet, can't change password")
  }
    
  } catch (error) {
    console.log(error.message)
    return res.send("Something went wrong");
   
    
  }
  
  
})


//reset password page post method
app.post('/resetPassword', async (req,res)=>{
  try {
    const newPassword=req.body.newPassword;
    const confirmPassword=req.body.confirmPassword;
    const resetemailpassword=await loginCollection.findOne({username:userforResetPassword});
    if(!newPassword || !confirmPassword){
      return res.send("new password can't be empty");
    }else if(newPassword===confirmPassword){
      let finalpass=newPassword;
      // console.log(finalpass)
      // console.log(userforResetPassword);
      const saltRounds = 10;
      const hashedPasswordReset = await bcrypt.hash(finalpass, saltRounds);
    
      finalpass = hashedPasswordReset;
      const updateInformation= await loginCollection.updateOne({resetemailpassword}, { $set:{password:finalpass}});
      console.log(updateInformation);
      if (updateInformation.modifiedCount > 0) {
        console.log('User information updated:', updateInformation);
        console.log('password changed');
  
      } else {
        return res.status(404).send('User not found or not updated');
      }




      


    }else{
      res.send("Password doesn't match");
    }
    
  } catch (error) {
    
  }
 

})







app.listen(port, (req, res) => {
  console.log(`server is running on ${port}`)
})
