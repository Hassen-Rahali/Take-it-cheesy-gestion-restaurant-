const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth= require('../services/authentication');
var checkRole =require('../services/checkRole');

