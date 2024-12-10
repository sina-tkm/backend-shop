const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const authRoutes = require("./route/authRoute");
const productRoute = require("./route/productRoute");

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/product", productRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
