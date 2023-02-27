const express = require("express");
const User = require('../models/userModel');

const registerUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body)
        res.status(200).json(newUser)
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

module.exports = {
    registerUser,
}