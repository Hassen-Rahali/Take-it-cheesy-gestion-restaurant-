const express = require("express");
const connection = require("../connection");
const { query } = require("../connection");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const nodemailer = require("nodemailer");

const auth = require("../services/auth");
const role = require("../services/checkRole");

const router = express.Router();

// handles POST requests to register a new user
router.post("/signup", (req, res) => {
  // get user data from request body
  let user = req.body;

  // prepare SQL query to check if email already exists in the database
  let query = "select email, password, role, status from user where email=?";

  // execute the SQL query with user's email as parameter
  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      // if there are no errors and the query returned no results, register the user
      if (results.length <= 0) {
        // prepare SQL query to insert a new user into the database
        let query =
            "insert into user(name, contactNumber, email, password, status, role) values(?, ?, ?, ?, 'false', 'user')";

        // execute the SQL query with user's data as parameters
        connection.query(
            query,
            [user.name, user.contactNumber, user.email, user.password],
            (err, results) => {
              if (!err) {
                // if registration is successful, return a success message
                return res.status(200).json({
                  message: "Successfully registered",
                });
              } else {
                // if there is an error during registration, return an error message
                return res.status(500).json({ err });
              }
            }
        );
      } else {
        // if the query returned results, the email already exists, so return an error message
        return res.status(400).json({ message: "Email already exists" });
      }
    } else {
      // if there is an error executing the SQL query, return an error message
      return res.status(500).json({ err });
    }
  });
});
// This route handles user login
router.post("/login", (req, res) => {

  // Retrieve user details from the request body
  const user = req.body;

  // Construct the query to fetch user details from the database
  let query = "select email, password, role, status from user where email=?";

  // Execute the query with user email as parameter
  connection.query(query, [user.email], (err, results) => {

    // Check if there are no errors while fetching user details from the database
    if (!err) {

      // Check if the query returned no results or the password is incorrect
      if (results.length <= 0 || results[0].password !== user.password) {
        return res.status(401).json({ message: "Incorrect username/password" });
      }
      // Check if the user is not yet approved by admin
      else if (results[0].status === "false") {
        return res.status(401).json({ message: "Await admin approval" });
      }
      // User credentials are correct, generate access token and send it in response
      else if (results[0].password === user.password) {

        // Create payload for the access token
        const response = {
          email: results[0].email,
          role: results[0].role,
        };

        // Generate access token using payload and secret key, set expiration to 1 hour
        const accessToken = jwt.sign(response, process.env.SECRET, {
          expiresIn: "1h",
        });

        // Send success response with access token
        res.status(200).json({
          token: accessToken,
          message: "User logged in",
        });
      }
      // Handle other cases
      else {
        return res
            .status(400)
            .json({ message: "Something went wrong. Please try again!" });
      }
    }
    // Handle database query error
    else {
      return res.status(500).json({ err });
    }
  });
});

// Create nodemailer transport with Gmail service and login credentials
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// Route for handling forgot password request
router.post("/forgotPassword", (req, res) => {
  const user = req.body;

  // Query to retrieve user email and password from the database based on the email provided
  let query = "select email, password from user where email=?";
  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      // If no user found with the provided email
      if (results.length <= 0) {
        return res.status(200).json({
          message: "Password sent to your email",
        });
      } else {
        // If user found with the provided email, send password to their email
        let mailOptions = {
          from: process.env.EMAIL,
          to: results[0].email,
          subject: "Password retrieval by Cafe Management system",
          html:
              "<p>Your login details for the Cafe Management System <br> Email: " +
              results[0].email +
              "<br> Password: " +
              results[0].password +
              "<br> <a href='http://localhost:4200'>Click Here to Login</a>" +
              "</p>",
        };

        // Send email with nodemailer
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log(info.response);
            console.log(" \n Email sent");
            return res.status(200).json({
              message: "Password sent to your email",
            });
          }
        });
      }
    } else {
      return res.status(500).json({ err });
    }
  });
});

// Route for getting all user data
router.get("/get", auth.authenticate, role.checkRole, (req, res) => {
  // Query to retrieve user data from the database where the user role is "user"
  let query = 'select id,name,email,contactNumber,status from user where role="user"';

  // Execute the query and send the data as response
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json({ data: results });
    } else {
      return res.status(500).json({ err });
    }
  });
});


// PATCH request to update user status based on ID
router.patch("/update", auth.authenticate, role.checkRole, (req, res) => {
  let user = req.body;
  let query = "update user set status=? where id=?";
  // update user status in the database
  connection.query(query, [user.status, user.id], (err, results) => {
    if (!err) {
      if (results.affectedRows == 0) {
        // if no rows are affected, return error message
        return res.status(404).json({ message: "User ID does not exist" });
      }
      // return success message if update is successful
      return res.status(200).json({ message: " User updated successfully" });
    } else {
      // return error message if query execution fails
      return res.status(500).json({ err });
    }
  });
});

// GET request to check if JWT token is valid
router.get("/checkToken", auth.authenticate, (req, res) => {
  // if token is valid, return true message
  return res.status(200).json({ message: "true" });
});

// POST request to change user password
router.post("/changePassword", auth.authenticate, (req, res) => {
  const user = req.body;
  const email = res.locals.email;
  // retrieve user details from database to check old password
  let query = "select * from user where email=? and password=?";
  connection.query(query, [email, user.oldPassword], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        // if old password does not match, return error message
        return res.status(400).json({ message: "Incorrect password" });
      } else if (results[0].password === user.oldPassword) {
        // update password in the database
        let query = "update user set password=? where email=?";
        connection.query(query, [user.newPassword, email], (err, results) => {
          if (!err) {
            // return success message if update is successful
            return res
                .status(200)
                .json({ message: "Password updated successfully" });
          } else {
            // return error message if query execution fails
            return res.status(500).json({ err });
          }
        });
      } else {
        // return error message for any other issues
        return res
            .status(400)
            .json({ message: "Something went wrong!! Please try again" });
      }
    } else {
      // return error message if query execution fails
      return res.status(500).json({ err });
    }
  });
});

module.exports = router;
