const express = require("express");
const router = express.Router();
const { sendOTP, verifyOTP } = require("../controller/authentication");

router.post("/otp", sendOTP);
router.post("/verify", verifyOTP);

module.exports = router;
