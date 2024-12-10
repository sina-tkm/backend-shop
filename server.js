const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const authRoutes = require("./route/authRoute"); // Make sure the path is correct
const productRoute = require("./route/productRoute"); // Make sure the path is correct
const cors = require("cors");

dotenv.config();
const app = express();

// cors options


// cors for all requests from frontend
app.use(cors());

app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/product", productRoute);

const PORT = process.env.PORT || 8000; // Default to port 8000 based on your .env
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
