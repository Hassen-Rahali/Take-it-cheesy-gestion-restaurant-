const express = require("express");
const connection = require("../connection");
const auth = require("../services/auth");
const role = require("../services/checkRole");

const router = express.Router();

// This route listens for POST requests on the "/add" path. It uses two middleware functions to authenticate the request and check the user's role. If both checks pass, the function creates a new category in the database by inserting its name into the "category" table. It then sends a response with a JSON message indicating success or failure.
router.post("/add", auth.authenticate, role.checkRole, (req, res, next) => {
  let category = req.body;
  let query = "insert into category (name) values(?)";
  connection.query(query, [category.name], (err, results) => {
    if (!err) {
      return res.status(200).json({ message: "Category added successfully" });
    } else {
      return res.status(500).json({ err });
    }
  });
});

// This route listens for GET requests on the "/get" path. It retrieves all categories from the "category" table and orders them by name. It then sends a response with a JSON object containing the category data or an error message if the query failed.
router.get("/get", (req, res, next) => {
  let query = "select * from category order by name";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json({ data: results });
    } else {
      return res.status(500).json({ err });
    }
  });
});

// This route listens for PATCH requests on the "/update" path. It uses two middleware functions to authenticate the request and check the user's role. If both checks pass, the function updates a category in the "category" table by setting its name to the new name provided in the request body. It then sends a response with a JSON message indicating success or failure. If the category ID provided in the request body does not exist in the table, it returns a 404 error instead of attempting to update.
router.patch("/update", auth.authenticate, role.checkRole, (req, res, next) => {
  let product = req.body;
  let query = "update category set name=? where id=?";
  connection.query(query, [product.name, product.id], (err, results) => {
    if (!err) {
      if (results.affectedRows == 0) {
        return res.status(404).json({ message: " Category ID not found" });
      }
      return res.status(200).json({ message: "Category updated successfully" });
    } else {
      return res.status(500).json({ err });
    }
  });
});

module.exports = router;
