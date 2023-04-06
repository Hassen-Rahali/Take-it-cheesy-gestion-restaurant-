// Import the Express.js framework
const express = require('express');
// Import the database connection module
const connection = require('../connection');
// Create a router instance
const router = express.Router();
// Import the authentication middleware
var auth = require('../services/authentication');

// Define a GET route for getting various counts
router.get('/details', auth.authenticateToken, (req, res, next) => {
// Declare variables to store the counts
    var categoryCount;
    var productCount;
    var billCount;
// Query the database to get the count of categories
    var categoryQuery = "select count(id) as categoryCount from category";
    connection.query(categoryQuery, (err, results) => {
        // If no error, store the category count
        if (!err) {
            categoryCount = results[0].categoryCount;
        }
        // If there's an error, return a 500 status and the error message
        else {
            return res.status(500).json(err);
        }
    })
// Query the database to get the count of products
    var productQuery = "select count(id) as productCount from product";
    connection.query(productQuery, (err, results) => {
        // If no error, store the product count
        if (!err) {
            productCount = results[0].productCount;
        }
        // If there's an error, return a 500 status and the error message
        else {
            return res.status(500).json(err);
        }
    })
// Query the database to get the count of bills
    var billQuery = "select count(id) as billCount from bill";
    connection.query(billQuery, (err, results) => {
        // If no error, store the bill count
        if (!err) {
            billCount = results[0].billCount;
            // Create a data object with the counts
            var data = {
                category: categoryCount,
                product: productCount,
                bill: billCount,
            };
            // Return a 200 status and the data object as JSON
            return res.status(200).json(data);
        }
        // If there's an error, return a 500 status and the error message
        else {
            return res.status(500).json(err);
        }
    })
})

// Export the router module
module.exports = router;