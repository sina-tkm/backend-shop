const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const jwtToken = (user) => {
  return jwt.sign(
    { email: user.email, userName: user.userName, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
};
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { jwtToken, verifyToken };
