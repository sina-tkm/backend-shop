const User = require("../model/User");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { where } = require("sequelize");
const { jwtToken } = require("../utils/authToken");
const bcrypt = require("bcryptjs");
const coockie = require("cookie");
const bcryptjs = require("bcryptjs");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
// generate OTP code
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};
// send OTP code to user
exports.sendOTP = async (req, res) => {
  const { email, userName, password } = req.body;
  try {
    let user = await User.findOne({
      where: { email: email, userName: userName },
    });
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
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
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: ` کد  اعتبار سنجی شما`,
      text: ` کد اعتبار شما : ${otp}`,
    });
    res.status(200).json({
      message: "OTP sent successfully",
      user: { email, userName, otp, otpExpiresAt },
    });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error });
  }
};
// verify otp code
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else if (user.otp === otp && user.otpExpiresAt > new Date()) {
      user.isVerified = true;
      user.otp = null;
      user.otpExpiresAt = null;
      await user.save();
    }

    res.setHeader("Set-Cookie", [
      coockie.serialize("access_token", "", {
        httpOnly: true,
        secure: true,
        maxAge: 0,
        path: "/",
      }),
    ]);

    res.setHeader("Set-Cookie", [
      coockie.serialize("access_token", jwtToken(user), {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 1000,
        path: "/",
      }),
    ]);
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error verifying OTP", error });
  }
};

// login user
exports.login = async (req, res) => {
  const { password, userName } = req.body;
  try {
    const user = await User.findOne({
      where: { userName: userName },
    });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const isMatched = await bcryptjs.compare(password, user.password);
    if (!isMatched) {
      return res.status(401).json({ message: "unauthorized" });
    } else {
      const userData = user.get();
      delete userData.password;
      res.setHeader(
        "access-token",
        jwtToken({ userName: user.userName, role: user.role })
      );
      return res
        .status(200)
        .json({ message: "Login successful", user: userData });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error logging in", error });
  }
};
