const express = require("express");
const User = require('../models/userModel');
const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const genWebToken = ({id}) => {
    const token = jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "12h"})
    return token;
};

// User Registration
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if(!name || !email || !password){
        res.status(400)
        throw new Error("Please provide all neccessary information")
    }
    if(password.length < 8){
        res.status(400)
        throw new Error("Password cannot be less than 8 characters")
    }
    const emailExist = await User.findOne({email});
    if(emailExist){
        res.status(400)
        throw new Error("Email address has been used")
    }


    const newUser = await User.create({name, email, password});
    if (newUser){
        const jwtToken = genWebToken(newUser._id);
        res.cookie("jwt", jwtToken, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 86400000),
            sameSite: "none",
            secure: true
        });
        const {_id, name, email, picture, bio} = newUser;
        res.status(201).json({_id, name, email, picture, bio, jwtToken})
    } else{
        res.status(400)
        throw new Error("Invalid user data")
    }
});

// User Login
const userLogin = asyncHandler(async (req, res) => {
    const {email, password} = req.body
    if (email && password){
        const user = await User.findOne({email});
        if (user){
            const passwordCheck = await bcrypt.compare(password, user.password);
            const {_id, name, email, picture, bio} = user
            if(passwordCheck){
                const jwtToken = genWebToken(user._id)
                res.cookie("jwt", jwtToken, {
                    path: "/",
                    httpOnly: true,
                    expires: new Date(Date.now() + 8640000),
                    secure: true,
                    sameSite: "none"
                })
                res.status(200).json({
                    _id,
                    name,
                    email,
                    picture,
                    bio,
                    jwtToken
                })
            } else{
                res.status(400)
                throw new Error("Email or Password incorrect!")
            }
        } else{
            res.status(400)
            throw new Error("Email or Password incorrect!")
        }
    } else{
        res.status(400)
        throw new Error("Email or Password not entered!")
    }
});

const userLogout = asyncHandler( async (req, res) => {
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0),
        sameSite: "none",
        secure: true
    })
    res.status(200).json({
        msg: "You have been logged out!"
    })
});

module.exports = {
    registerUser,
    userLogin,
    userLogout
}