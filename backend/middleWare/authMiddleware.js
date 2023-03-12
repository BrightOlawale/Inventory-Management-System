const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel")


const authenticate =  asyncHandler ( async (req, res, next) => {
    try {
        // const token =  req.headers.cookie.substring(6,  req.headers.cookie.length);
        const token = req.headers.authorization.split('Bearer ')[1];
        if(token){
            const validateToken = await jwt.verify(token, process.env.JWT_SECRET);
            if(validateToken){
                const user = await User.findById(validateToken.id).select("-passsword");
                if(!user){
                    res.status(401)
                    throw new Error("User not found, please register")
                }
                req.user = user
                next();
            } else{
                res.status(401)
                throw new Error("Not Authorized, please login")
            }
        } else{
            res.status(401)
            throw new Error("You are not Logged in")
        }    
    } catch (error) {
        res.status(401)
        throw new Error("Not authorized, please log in")
    }
})

module.exports = authenticate;