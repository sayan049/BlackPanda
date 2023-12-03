const { error } = require('console');
const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const emailValidator = require('email-validator')
var flush=require('connect-flash')
var session=require('express-session')
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
app.use(session({
  secret:'secret',
  cookie:{maxAge: 60000},
  resave:false,
  saveUninitialized:false

}));
app.use(flush());


//port
const port = 3080;

//for send mail
const sendVerifyMail = async (name, email, user_id) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'blaackpaandaaa@gmail.com',
        pass: 'zihz jnyp aqjh spmz'
      }

    });
    const mailOptions = {
      from: 'blaackpaandaaa@gmail.com',
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
// let userforResetPassword ;

//for log-in page

app.get('/login', (req, res) => {
  res.render('login')

})
app.get('/signup', (req, res) => {
  // Ensure that 'message' and 'message1' are always defined
  // const message = req.flash('message') || '';
  // const message1 = req.flash('message1') || '';
  // const message2 = req.flash('message2') || '';
  // const message3 = req.flash('message3') || '';

  res.render('sign_up');
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
      // req.flash('message','Fill all the fields to sign up!');
       res.redirect('/signup');
    
    } else if (existUser) {
     // return res.send("Username already exists");
    //  req.flash('message1','Username already exists!');
       res.redirect('/signup');
    } else if (!emailValidator.validate(req.body.email)) {
     //return res.send("Email is not valid");
    //  req.flash('message2','Email is not valid!');
       res.redirect('/signup');
    } else if (emailValidator.validate(req.body.email) && !validEmail) {
      // Insert data into the database
      await loginCollection.insertMany([data]);
      console.log(data);

      // Send verification email
      sendVerifyMail(req.body.name, req.body.email, req.body.username);

      // Render the index page
      res.render("index", { datanames: req.datas });
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
      //   req.flash('message3','There is a BlackPanda account with this email !');
      // res.redirect('/signup');
      } else {
        // Insert data into the database
        await loginCollection.insertMany([data]);
        console.log(data);

        // Send verification email
        sendVerifyMail(req.body.name, req.body.email, req.body.username);

        // Render the index page
        res.render("index", { datanames: req.datas });
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
      return res.send("username can't empty")

    }
    else if (!check) {
      return res.send("username not found");
    }else if(check && check.is_verified == 1){
      const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
      if (isPasswordMatch) {
        res.render('index', { datanames: req.datas })
      } else {
        return res.send("wrong password");
      }

    }else{
      return res.send("Your email is not verified, please verify your email ");
    }

   
  } catch {
    res.send("wrong details")

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
   return res.json("mail can't be empty");
  }else if(emailValidator.validate(mail) && !findEmail){
    return res.send("email not found");
  }else if(emailValidator.validate(mail) && findEmail && boolean == false){
    sendResetPasswordLink(nameForreset,usernameForreset,mail);
    res.send("email sent")

  }else{
    res.send("Email is not verified yet, can't change password!")
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
