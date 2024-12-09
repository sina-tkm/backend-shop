const { verifyToken } = require("../utils/authToken");

const isAdminMiddleware = (req, res, next) => {
  const token = req.cookies["access-token"];
  if (token) {
    const decoded = verifyToken(token);
    decoded.role === "admin"
      ? next()
      : res.status(401).res.json({ message: "دسترسی غیر مجاز" });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};
