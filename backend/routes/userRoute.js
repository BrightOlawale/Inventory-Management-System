const express = require("express");
const { registerUser } = require("../controllers/userController");
const User = require('../models/userModel');

const router = express.Router();

router.post("/register", registerUser);

module.exports = router;