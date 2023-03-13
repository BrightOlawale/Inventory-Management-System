const express = require("express");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Token = require("../models/tokenModel");
const crypto = require("crypto");
const mailSender = require("../utils/mailSender");


const genWebToken = ({ id }) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  return token;
};

// User Registration
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide all neccessary information");
  }
  if (password.length < 8) {
    res.status(400);
    throw new Error("Password cannot be less than 8 characters");
  }
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    res.status(400);
    throw new Error("Email address has been used");
  }

  const newUser = await User.create({ name, email, password });
  if (newUser) {
    const jwtToken = genWebToken({id: newUser._id});
    // res.cookie("token", jwtToken, {
    //     path: "/",
    //     httpOnly: false,
    //     expires: new Date(Date.now() + 86400 * 1000),
    //     sameSite: "none",
    //     secure: false
    // });
    const { _id, name, email, phone, picture, bio } = newUser;
    res.status(201).json({ 
        user: {
            _id, 
            name, 
            email, 
            phone,
            picture, 
            bio, 
        },
        token: jwtToken
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// User Login
const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const user = await User.findOne({ email });
    if (user) {
      const passwordCheck = await bcrypt.compare(password, user.password);
      const { _id, name, email, phone, picture, bio } = user;
      if (passwordCheck) {
        const jwtToken = genWebToken({id: user._id});
        // res.cookie("token", jwtToken, {
        //   path: "/",
        //   httpOnly: false,
        //   expires: new Date(Date.now() + 86400 * 1000),
        //   secure: false,
        //   sameSite: "none",
        // });
        res.status(200).json({
            user: {
                _id,
                name,
                email,
                phone,
                picture,
                bio,
            },
            token: jwtToken
        });
      } else {
        res.status(400);
        throw new Error("Email or Password incorrect!");
      }
    } else {
      res.status(400);
      throw new Error("Email or Password incorrect!");
    }
  } else {
    res.status(400);
    throw new Error("Email or Password not entered!");
  }
});

// Logout User
const userLogout = asyncHandler(async (req, res) => {
  // res.cookie("token", "", {
  //   path: "/",
  //   httpOnly: true,
  //   expires: new Date(0),
  //   sameSite: "none",
  //   secure: true,
  // });
  res.status(200).json({
    msg: "You have been logged out!",
    token: ""
  });
});

// Get User
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user){
    res.status(400)
    throw new Error("User not found")
  }
  const {name, email, phone, bio, picture} = user;
  res.status(200).json({
    user: {
        name,
        email,
        phone,
        bio,
        picture
    }
  })
});

const updateDetails = asyncHandler( async (req, res) => {
  const user = await User.findById(req.user._id);
  if(!user){
    res.status(400)
    throw new Error("User not found")
  }
  const { name, email, phone, picture, bio } = user;
  user.email = email
  user.name = req.body.name || name 
  user.phone = req.body.phone || phone
  user.picture = req.body.picture || picture
  user.bio = req.body.bio || bio

  const latestDetails = await user.save()
  if (!latestDetails){
    res.status(400)
    throw new Error("Unable to process details")
  }
  res.status(200).json({
    _id: latestDetails._id,
    name: latestDetails.name,
    email: latestDetails.email,
    phone: latestDetails.phone,
    picture: latestDetails.picture,
    bio: latestDetails.bio
  })
})

const changePassword = asyncHandler( async(req, res) => {
  const user = await User.findById(req.user._id);
  if(!user){
    res.status(400);
    throw new Error("User not found")
  }

  const { prevPassword, newPassword } = req.body;
  if(!prevPassword && !newPassword){
    res.status(400)
    throw new Error("Please provide both old and new password!")
  }

  const checkPassword = await bcrypt.compare(prevPassword, user.password);
  if(!checkPassword){
    res.status(400)
    throw new Error("Old password incorrect")
  }  
  user.password = newPassword;
  const savePassword = await user.save();
  if(!savePassword){
    res.status(400)
    throw new Error("Couldn't save password")
  }
  res.status(200).json({
    msg: "Password Changed successfuly"
  })
})

const forgotPassword = asyncHandler(async (req, res) => {
  const {email} = req.body
  if(!email){
    res.status(400)
    throw new Error("Please enter a Valid email");
  }
  const user = await User.findOne({email});
  if(!user){
    res.status(404)
    throw new Error("Invalid email address")
  }

  const checkTok = await Token.findOne({ userTokID: user._id });
  if(checkTok){
    await checkTok.deleteOne();
  } 

  const genTok = crypto.randomBytes(32).toString("hex") + user._id;
  const hashGenTok = crypto.createHash("sha256").update(genTok).digest("hex");
  
  await new Token({
    userTokID: user._id,
    token: hashGenTok,
    createdAt: Date.now(),
    expireAt: Date.now() + 15 * (60 * 1000)
  }).save()

  const resetLink = `${process.env.FRONT_URL}/resetpassword/${genTok}`;

  const emailMessage = `
    <h2>Hello ${user.name}</h2>
    <p>Please click on the link below to reset your password.</p>
    <p>This link expires in 15 minutes </p>
    <a href=${resetLink} clicktracking=off>${resetLink}</a>

    <p>Thank you...</p>
    <p>The Briteema team </p>
  `

  const subject = "Briteema Password Reset"
  const sender = process.env.EMAIL_USER
  const reciever = user.email

  try {
    await mailSender(reciever, subject, emailMessage, sender)
    res.status(200).json({
      state: "Successful",
      message: "Reset email sent"
    })
  } catch (error) {
    res.status(500)
    throw new Error("Failed to send email")
  }
})

const resetPassord = asyncHandler(async(req, res) => {
  const {password} = req.body;
  const {resetToken} = req.params;

  const hashTok = crypto.createHash("sha256").update(resetToken).digest("hex");
  const userTok = await Token.findOne({
    token: hashTok,
    expireAt: {$gt: Date.now()}
  })

if(!userTok){
  res.status(404)
  throw new Error("Invalid User or token")
}

const user = await User.findById({_id: userTok.userTokID})

user.password = password;
await user.save()

res.status(200).json({
  message: "Password reset successful"
})

})

module.exports = {
  registerUser,
  userLogin,
  userLogout,
  getUser,
  updateDetails,
  changePassword,
  forgotPassword,
  resetPassord
};
