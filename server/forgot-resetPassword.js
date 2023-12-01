const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')



const sendResetPasswordLink = async (name,  username,email) => {
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
        subject: 'For reseting password',
        html: '<p>Hii ' + name + ', please click here to <a href="http://127.0.0.1:3080/resetPassword?user=' + username + '"> reset </a> your password. </p> '
      }
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
      return true;
    } catch (error) {
      console.error('Failed to send verification email:', error.message);
      return false;
    }
  }

  module.exports=sendResetPasswordLink;