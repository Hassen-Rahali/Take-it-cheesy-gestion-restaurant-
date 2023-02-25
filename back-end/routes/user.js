const express = require('express');
const connection = require('../connection');
const router = express.Router();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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
                return res.status(401).json({essage:"Wait for Admn Approval"});
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
    host :
})
 // API forgetPassword
router.post('/forgetpassword',(req,res)=> {
    const user = req.body;
    query = "select email,password from user where email=?";
    connection.query(query, [user.email], (err, results) => {
        if(!err){
            if(results.length <= 0){
                return res.status(200).json({message:"Password sent successfully to your email"});
            }
            else{
                var mail
            }
        }
    })

})
module.exports = router;