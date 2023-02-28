const express = require("express");
const User = require('../models/userModel');
const asyncHandler = require("express-async-handler")


const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    if(!name || !email || !password){
        res.status(400)
        throw new Error("Please provide all neccessary information")
    }
    if(password.length < 8){
        res.status(400)
        throw new Error("Password cannot be less than 8 characters")
    }
    const emailExist = await User.findOne({email})
    if(emailExist){
        res.status(400)
        throw new Error("Email address has been used")
    }


    const newUser = await User.create({name, email, password})
    if (newUser){
        const {_id, name, email, picture, bio} = newUser
        res.status(201).json({_id, name, email, picture, bio})
    } else{
        res.status(400)
        throw new Error("Invalid user data")
    }
})

module.exports = {
    registerUser,
}