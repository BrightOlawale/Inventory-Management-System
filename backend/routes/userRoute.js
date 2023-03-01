const express = require("express");
const { registerUser, userLogin, userLogout } = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", userLogin);
router.get("/logout", userLogout);

module.exports = router;