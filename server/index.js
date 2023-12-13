const { error } = require('console');
const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const emailValidator = require('email-validator')
var flush=require('connect-flash')
var session=require('express-session')
const sendResetPasswordLink=require('./forgot-resetPassword');
const sendVerifyMail=require('./mailVerify')
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
app.use(session({
  secret:'secret',
  cookie:{maxAge: 60000},
  resave:false,
  saveUninitialized:false

}));
app.use(flush());


//port
const port = process.env.PORT||3081;






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
    const messagesuc = req.flash('messagesuc') || '';
    // console.log("message success is = "+messagesuc)
    res.render("index", { datanames: req.datas, messagesuc });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//reseting password variable
// let userforResetPassword ;

//for log-in page

app.get('/login', (req, res) => {
  const message = req.flash('message') ;
  const forgetmessage = req.flash('forgetmessage') ;
  const forgetmessagesuccess = req.flash('forgetmessagesuccess') ;
  //console.log('login message error is = ' + messageerrlogin)
  res.render('login', {message,forgetmessage,forgetmessagesuccess}); // Pass messageerr to the template
});
app.get('/signup', (req, res) => {
  // Ensure that 'message' and 'message1' are always defined
  
   const messageerr = req.flash('messageerr') ;
  // const message2 = req.flash('message2') || '';
  // const message3 = req.flash('message3') || '';

  res.render('sign_up',{messageerr});
});
app.get('/products', (req, res) => {
  res.render('specProd')

})
app.get('/resetPassword', async(req, res)=>{
  res.render('resetPassword')
    userforResetPassword=req.query.user;
  
})






//for pop up handeling



// entering data in the database
app.post('/signup', async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      is_admin: 0,
      password: req.body.password
    };

    // Replace password with hashed password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    data.password = hashedPassword;

    // Check if the username exists or not
    const validEmail = await loginCollection.findOne({ email: req.body.email });
    const existUser = await loginCollection.findOne({ username: data.username });

    if (!data.name || !data.username || !data.email || !data.password) {
      //  return res.send("Fill all the fields to sign up");
       req.flash('messageerr','Fill all the fields to sign up !');
       res.redirect('/signup');
    
    } else if (existUser) {
     // return res.send("Username already exists");
      req.flash('messageerr','Username already exists !');
       res.redirect('/signup');
    } else if (!emailValidator.validate(req.body.email)) {
     //return res.send("Email is not valid");
      req.flash('messageerr','Email is not valid!');
       res.redirect('/signup');
    } else if (emailValidator.validate(req.body.email) && !validEmail) {
      
      // Insert data into the database
      await loginCollection.insertMany([data]);
      console.log(data);

      // Send verification email
      sendVerifyMail(req.body.name, req.body.email, req.body.username);

      // Render the index page
      // res.render("index", { datanames: req.datas });
      req.flash('forgetmessagesuccess','you are signed up now!, verification link has been sent to your email');
      res.redirect('/login')

    } else if (emailValidator.validate(req.body.email) && validEmail) {
      // Use cursor to iterate over documents asynchronously
      let bool = true;
      const cursor = await loginCollection.find({ email: req.body.email }).cursor();

      for await (const doc of cursor) {
        if (doc.is_verified == 1) {
          bool = false;
        }
        // console.log(bool);
      }

      // console.log(bool);

      if (bool == false) {
        //return res.send("There is a BlackPanda account with this email: ");
         req.flash('messageerr','This Email is already in use !');
       res.redirect('/signup');
      } else {

      //  req.flash('messagesuc','you are signed up now!');
      //  res.redirect('/signup');


        // Insert data into the database
        await loginCollection.insertMany([data]);
        console.log(data);

        // Send verification email
        sendVerifyMail(req.body.name, req.body.email, req.body.username);

        // Render the index page
        //res.render("index", { datanames: req.datas });
        req.flash('forgetmessagesuccess','you are signed up now!, verification link has been sent to your email');
        res.redirect('/login')
      }
    } else {
      return res.status(500).send("Internal server error");
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Internal server error");
  }
});




//endpoint in mailverify

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
      //return res.send("username can't empty")
      req.flash('message',"username can't empty");
      res.redirect('/login')

    }
    else if (!check) {
      //return res.send("username not found");
      req.flash('message',"username not found");
      res.redirect('/login')


    }else if(check && check.is_verified == 1){
      const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
      if (isPasswordMatch) {
       // res.render('index', { datanames: req.datas })
       req.flash('messagesuc','Logged in successfully');
        res.redirect('/')
      } else {
        //return res.send("wrong password");
        req.flash('message',"wrong password");
      res.redirect('/login')
      }

    }else{
      //return res.send("Your email is not verified, please verify your email ");
      req.flash('message',"Your email is not verified, please verify your email ");
      res.redirect('/login')
    }

   
  } catch {
    res.send("wrong details")
    // req.flash('x',"wrong details");
  }
})


//forgot password post method

app.post('/forgotPassword', async (req,res) => {
  let boolean = true;
  let nameForreset="";
  let usernameForreset="";
  const mail=req.body.email;
  const cursor = await loginCollection.find({ email: mail }).cursor();

  for await (const doc of cursor) {
    if (doc.is_verified == 1) {
      boolean = false;
      nameForreset=doc.name;
      usernameForreset=doc.username;
    }
    // console.log(bool);
  }


  try {
   
    
  const findEmail=await loginCollection.findOne({email:mail});
  // const verifiedEmail=await loginCollection.findOne({email:findEmail.is_verified : 1})
  // console.log(findEmail.is_verified);

  if(!mail){
   //return res.json("mail can't be empty");
   req.flash('forgetmessage',"mail can't be empty");
   res.redirect('/login');

  }else if(emailValidator.validate(mail) && !findEmail){
    return res.send("email not found");
  }else if(emailValidator.validate(mail) && findEmail && boolean == false){
    sendResetPasswordLink(nameForreset,usernameForreset,mail);
    //res.send("email sent")
    req.flash('forgetmessagesuccess',"Email sent successfully !");
   res.redirect('/login');

  }else{
    //res.send("Email is not verified yet, can't change password!")
    req.flash('forgetmessage',"Email is not verified yet, can't change password!");
   res.redirect('/login');
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
    let x=userforResetPassword;
    // const resetemailpassword=await loginCollection.findOne({username:x});
    if(!newPassword || !confirmPassword){
      return res.send("new password can't be empty");
    }else if(newPassword===confirmPassword){
      let finalpass=newPassword;
      console.log(finalpass);
      // 
      // console.log(finalpass)
      // console.log(userforResetPassword);
      const saltRounds = 10;
      const hashedPasswordReset = await bcrypt.hash(finalpass, saltRounds);
    
      finalpass = hashedPasswordReset;
      const updateInformation= await loginCollection.updateOne({username:x}, { $set:{password:finalpass}});
      // console.log(updateInformation);
      if (updateInformation.modifiedCount > 0) {
        console.log('User information updated:', updateInformation);
        console.log('password changed');
        return res.send("password changed succesfully");
  
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
