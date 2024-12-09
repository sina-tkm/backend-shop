const User = require("../model/user");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const coockie = require("cookie");

// Set up email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate OTP code
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Generate Access Token
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, userName: user.userName, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h", // Token expires in 1 hour
    }
  );
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d", // 7 days expiration
    }
  );
};

// Send OTP to user via email
exports.sendOTP = async (req, res) => {
  const { email, userName, password } = req.body;
  try {
    let user = await User.findOne({ where: { email, userName } });

    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expiration time: 5 minutes

    if (!user) {
      const hashedPassword = await bcryptjs.hash(password, 10);
      user = await User.create({
        email,
        userName,
        otp,
        otpExpiresAt,
        password: hashedPassword,
      });
    } else {
      user.otp = otp;
      user.otpExpiresAt = otpExpiresAt;
      await user.save();
    }

    // Send OTP email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "کد اعتبار سنجی شما",
      text: `کد اعتبار شما: ${otp}`,
    });

    res.status(200).json({
      message: "OTP sent successfully",
      user: { email, userName, otp, otpExpiresAt },
    });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error });
  }
};

// Verify OTP and issue tokens
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check OTP and expiration
    if (user.otp === otp && user.otpExpiresAt > new Date()) {
      user.isVerified = true;
      user.otp = null;
      user.otpExpiresAt = null;
      await user.save();

      // Generate tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Set cookies with the tokens
      res.setHeader("Set-Cookie", [
        coockie.serialize("access_token", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 60 * 60 * 1000, // 1 hour for access token
          path: "/",
        }),
        coockie.serialize("refresh_token", refreshToken, {
          httpOnly: true,
          secure: true,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for refresh token
          path: "/",
        }),
      ]);

      return res.status(200).json({ message: "OTP verified successfully" });
    }

    return res.status(400).json({ message: "Invalid or expired OTP" });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP", error });
  }
};

// Refresh the access token using the refresh token
exports.refreshToken = async (req, res) => {
  const { refresh_token } = req.cookies;

  if (!refresh_token) {
    return res.status(400).json({ message: "Refresh token missing" });
  }

  try {
    const decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newAccessToken = generateAccessToken(user);

    res.setHeader("Set-Cookie", [
      coockie.serialize("access_token", newAccessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 1000, // 1 hour for new access token
        path: "/",
      }),
    ]);

    return res
      .status(200)
      .json({ message: "Token refreshed successfully", newAccessToken });
  } catch (error) {
    return res.status(500).json({ message: "Error refreshing token", error });
  }
};

// Login user
exports.login = async (req, res) => {
  const { password, userName } = req.body;

  try {
    const user = await User.findOne({ where: { userName } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatched = await bcryptjs.compare(password, user.password);
    if (!isMatched) {
      return res.status(401).json({ message: "Unauthorized" });
    } else {
      const userData = user.get();
      delete userData.password;

      // Generate tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Set cookies with the tokens
      res.setHeader("Set-Cookie", [
        coockie.serialize("access_token", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 60 * 60 * 1000, // 1 hour for access token
          path: "/",
        }),
        coockie.serialize("refresh_token", refreshToken, {
          httpOnly: true,
          secure: true,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for refresh token
          path: "/",
        }),
      ]);

      return res
        .status(200)
        .json({ message: "Login successful", user: userData });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error logging in", error });
  }
};

// Get user data by token
exports.getUserDataByToken = async (req, res) => {
  const token = req.cookies.access_token;

  try {
    if (!token) {
      return res.status(400).json({ message: "Token is missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User found", user });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, please refresh" });
    }

    res.status(500).json({ message: "Error getting user data", error });
  }
};
