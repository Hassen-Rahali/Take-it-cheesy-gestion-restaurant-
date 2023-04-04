const express = require('express');
const connection = require('../connection');
const router = express.Router();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();
var auth= require('../services/authentication')
var checkRole =require('../services/checkRole')

       //API sign up
router.post('/signup',(req,res) => {
    let user = req.body;
    query = "select email,password,role,status from user where email=?"
    connection.query(query,[user.email],(err,results)=>{
        if(!err){
            if(results.length <=0){
                query = "insert into user(name,contactNumber,email,password,status,role) values (?,?,?,?,'false','user')";
                connection.query(query,[user.name,user.contactNumber,user.email,user.password],(err,results)=>{
                    if(!err){
                        return res.status(200).json({message:"Successfuly Registered"});
                    }
                    else{
                        return res.status(500).json(err);
                    }
                })
            }
            else{
                return res.status(400).json({message: "Email Already Exist."});
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})
   // API login
router.post('/login',(req,res)=>{
    const user = req.body;
    query = "select email,password,role,status,name from user where email=?";
    connection.query(query,[user.email],(err,results)=>{
        if(!err){
            if (results.length <= 0 || results[0].password != user.password){
                return res.status(401).json({message : "Incorrect Username or Password"});
            }
            else if ( results[0].status === 'false'){
                return res.status(401).json({message:"Wait for Admin Approval"});
            }
            else if (results[0].password == user.password){
                const response = {email:results[0].email, role:results[0].role,name:results[0].name}
                const accessToken = jwt.sign(response,process.env.ACCESS_TOKEN,{expiresIn: '8h'})
                res.status(200).json({token : accessToken});
            }
            else{
                return res.status(400).json({message:"Somthing went wrong.Please try again later"});
            }
        }
        else{
            return res.status(500).json(err);
        }
    })

})
var transporter = nodemailer.createTransport({
    service :'gmail',
    auth:{
        user: process.env.EMAIL,
        user: process.env.PASSWORD,
    }
})
 // API forgetPassword
router.post('/forgetPassword',(req,res)=> {
    const user = req.body;
    query = "select email,password from user where email=?";
    connection.query(query, [user.email], (err, results) => {
        if(!err){
            if(results.length <= 0)
            {
                return res.status(200).json({message:"PASSWORD sent successfully TO YOUR EMAIL"});
            }
            else{
                var mailOption={
                    from: process.env.EMAIL,
                    to: results[0].email,
                    subject:'Password By Cafe Managment System',
                    html:'<p><b>Your Login detail For Cafe Management System</b><br><b>Email:</b>'+results[0].email+'<br><b>Password: </b>'+results[0].password+'<br><a href="http://localhost:4200/">Click Here To Login</a></p>'
                };
                transporter.sendMail(mailOption,function(error,info){
                    if(error){
                        console.log(error);
                    }
                    else{
                        console.log('Email sent '+info.response);
                    }
                });
                return res.status(200).json({message:"Password sent successfully to your email"});
            }
        }
        else{
            return res.status(500).json(err);
        }
    })

})
router.get('/get',auth.authenticateToken,checkRole.checkRole,(req,res)=>{
    var query ="select id,name,email,contactNumber,status from user where role='user'";
    connection.query(query,(err,results)=>{
        if(!err){
            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    })
})
router.put('/update',auth.authenticateToken,checkRole.checkRole,(req,res)=>{
    let user = req.body;
    var query = "update user set status=? where id=?";
    connection.query(query,[user.status,user.id],(err,results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message:"User id does not exist"});
            }
            return res.status(200).json({message:"User Updated Successfully"});
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.post('/changePassword',auth.authenticateToken,(req, res)=>{
    const user = req.body;
    const email = res.locals.email;
    var query = "select * from user where email=? and password=?";
    connection.query(query, [email, user.oldPassword], (err, results)=>{
        if(!err){
            if(results.length <= 0){
                return res.status(400).json({ message: "Incorrect Old Password"});
            }
            else if (results[0].password == user.oldPassword){
                query ="update user set password=? where email=?";
                connection.query(query, [user.newPassword, email], (err, results)=>{
                    if (!err){
                        return res.status(200).json({message: "Password Updated Successfully."})
                    }
                    else {
                        return res.status(500).json(err);
                    }
                })
            }
            else{
                return res.status(400).json({ message: "Something went wrong. Please try again later"});
            }
        }
        else{
            return res.status(500).json(err);
        }
    })
})

module.exports = router;