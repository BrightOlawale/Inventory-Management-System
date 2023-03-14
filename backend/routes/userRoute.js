const express = require("express");
const { registerUser, 
    userLogin,
    userLogout,
    getUser,
    updateDetails,
    changePassword,
    forgotPassword, 
    resetPassord} = require("../controllers/userController");
const authenticate = require("../middleWare/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", userLogin);
router.get("/logout", userLogout);
router.get("/getuser", authenticate, getUser);
router.patch("/update", authenticate, updateDetails)
router.patch("/updatepassword", authenticate, changePassword);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassord);

module.exports = router;