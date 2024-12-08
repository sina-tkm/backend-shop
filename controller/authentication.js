const User = require("../model/User");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { where } = require("sequelize");

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
  const { email, name } = req.body;
  try {
    let user = await User.findOne({ where: { email: email } });
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    if (!user) {
      user = await User.create({ email, name, otp, otpExpiresAt });
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
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error });
  }
};

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
      return res.status(200).json({ message: "OTP verified successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error verifying OTP", error });
  }
};
