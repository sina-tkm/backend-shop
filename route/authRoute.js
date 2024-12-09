const express = require("express");
const router = express.Router();
const {
  sendOTP,
  verifyOTP,
  login,
  refreshToken,
  getUserDataByToken,
} = require("../controller/authentication");
const {
  isAuthenticatedMiddleware,
} = require("../middlewares/isAdminMiddleware");

// Route for sending OTP
router.post("/send-otp", sendOTP);

// Route for verifying OTP
router.post("/verify-otp", verifyOTP);

// Route for user login
router.post("/login", login);

// Route for refreshing the access token
router.post("/refresh-token", refreshToken);

// Route to get user data based on token
router.get("/user", getUserDataByToken);

module.exports = router;
