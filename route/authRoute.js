const express = require("express");
const router = express.Router();
const { sendOTP, verifyOTP, login } = require("../controller/authentication");

router.post("/otp", sendOTP);
router.post("/verify", verifyOTP);
router.post("/login", login);

module.exports = router;
