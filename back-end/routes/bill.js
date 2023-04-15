const express = require("express");
const connection = require("../connection");
const auth = require("../services/auth");
const ejs = require("ejs");
const pdf = require("html-pdf");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");
const router = express.Router();



// Endpoint to generate a PDF report from order details
router.post("/generateReport", auth.authenticate, (req, res) => {
    // Extract the order details from the request body
    const orderDetails = req.body;

    // Generate a unique ID for the PDF report
    const generatedUUID = uuid.v1();

    // Parse the product details from the order details
    let productDetailsReport = JSON.parse(orderDetails.productDetails);

    // Construct a SQL query to insert the order details into the database
    let query = "insert into bill (name, uuid, email, contactNumber, paymentMethod, total, productDetails, createdBy) values(?,?,?,?,?,?,?,?)";

    // Execute the SQL query with the order details and user email
    connection.query(query, [
            orderDetails.name,
            generatedUUID,
            orderDetails.email,
            orderDetails.contactNumber,
            orderDetails.paymentMethod,
            orderDetails.totalAmount,
            orderDetails.productDetails,
            res.locals.email,
        ],
        (err, results) => {
            if (!err) {
                // Render the PDF report template with the order details
                ejs.renderFile(
                    path.join(__dirname, "", "report.ejs"),
                    {
                        productDetails: productDetailsReport,
                        name: orderDetails.name,
                        email: orderDetails.email,
                        contactNumber: orderDetails.contactNumber,
                        paymentMethod: orderDetails.paymentMethod,
                        totalAmount: orderDetails.totalAmount,
                    },
                    (err, results) => {
                        if (err) {
                            // Return an error response if there was an error rendering the template
                            return res.status(500).json({ err });
                        } else {
                            // Create the PDF report from the rendered template and save it to a file
                            pdf.create(results).toFile("../generated_PDF/" + generatedUUID + ".pdf", (err, data) => {
                                if (err) {
                                    // Return an error response if there was an error creating the PDF report
                                    console.log(err);
                                    return res.status(500).json({ err });
                                } else {
                                    // Return a success response with the unique ID of the PDF report
                                    return res.status(200).json({ uuid: generatedUUID });
                                }
                            });
                        }
                    });
            } else {
                // Return an error response if there was an error executing the SQL query
                return res.status(500).json({ err });
            }
        }
    );
});
// Define route for getting PDF
router.post("/getPDF", auth.authenticate, (req, res) => {

    // Get the order details from the request body
    const orderDetails = req.body;

    // Construct the path to the PDF file
    const pdfPath = "../generated_PDF/" + orderDetails.uuid + ".pdf";

    // If the PDF file already exists, send it as a response
    if (fs.existsSync(pdfPath)) {
        res.contentType("application/pdf");
        fs.createReadStream(pdfPath).pipe(res);
    }
    // Otherwise, generate the PDF file using the EJS template and send it as a response
    else {
        // Parse the product details from the order details
        let productDetailsReport = JSON.parse(orderDetails.productDetails);

        // Render the EJS template and pass in the order details and product details
        ejs.renderFile(
            path.join(__dirname, "", "report.ejs"),
            {
                productDetails: productDetailsReport,
                name: orderDetails.name,
                email: orderDetails.email,
                contactNumber: orderDetails.contactNumber,
                paymentMethod: orderDetails.paymentMethod,
                totalAmount: orderDetails.totalAmount,
            },
            (err, results) => {
                if (err) {
                    // If there's an error rendering the template, send a 200 response with the error message
                    return res.status(200).json({ err });
                } else {
                    // Generate the PDF file from the EJS template using the pdf.create() method
                    pdf.create(results).toFile("./generated_PDF/" + orderDetails.uuid + ".pdf", (err, data) => {
                        if (err) {
                            // If there's an error generating the PDF file, send a 500 response with the error message
                            console.log(err);
                            return res.status(500).json({ err });
                        }
                        else {
                            // If the PDF file is generated successfully, send it as a response
                            res.contentType("application/pdf");
                            fs.createReadStream(pdfPath).pipe(res);
                        }
                    });
                }
            });
    }
});

// Define route for getting all bills
router.get("/getBills", auth.authenticate, (req, res, next) => {

    // Construct the query for selecting all bills from the database
    let query = "select * from bill order by id DESC";

    // Execute the query and send the results as a response
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json({ data: results });
        } else {
            // If there's an error executing the query, send a 500 response with the error message
            return res.status(500).json({ err });
        }
    });
});

// Handle DELETE request to delete a bill by its ID
router.delete("/delete/:id", auth.authenticate, (req, res, next) => {
    const id = req.params.id; // Extract bill ID from request parameters
    let query = "delete from bill where id=?"; // Define SQL query to delete bill from database
    connection.query(query, [id], (err, results) => { // Execute query with extracted ID as parameter
        if (!err) { // If there's no error in query execution
            if (results.affectedRows == 0) { // If no row is affected by the delete operation
                return res.status(404).json({ message: "Bill ID not found" }); // Return 404 with error message
            }
            return res.status(200).json({ message: "Bill deleted successfully" }); // Return 200 with success message
        } else { // If there's an error in query execution
            return res.status(500).json({ err }); // Return 500 with error message
        }
    });
});

module.exports = router; // Export router to be used in other modules
