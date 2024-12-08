// route/userroute.js
const express = require("express");
const Members = require("../model/members");
const router = express.Router();

// Create a new user
router.post("/create", async (req, res) => {
  const { email, biography, otpCode, otpExpiresAt } = req.body;
  try {
    const user = await Members.create({
      email,
      biography,
      otpCode,
      otpExpiresAt,
      isVerifiedEmail: false,
      isActive: false,
    });
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
});

// Activate user
router.post("/activate/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await Members.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isActive = true;
    await user.save();
    res.status(200).json({ message: "User activated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error activating user", error });
  }
});

module.exports = router;
