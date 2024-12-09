const jwt = require("jsonwebtoken");
const User = require("../model/user");

const isAuthenticatedMiddleware = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Set the decoded user information in the request object
      req.user = decoded;

      // Find the user in the database
      const user = await User.findOne({ where: { id: decoded.id } });
  

      if (user && user.role === "admin") {
        return next();
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    } catch (error) {
      return res.status(401).json({ message: "توکن نامعتبر" });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { isAuthenticatedMiddleware };
