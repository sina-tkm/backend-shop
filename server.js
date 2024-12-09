// server.js
const express = require("express");
const dotenv = require("dotenv");
const coockiParser = require("cookie-parser");
const authRoutes = require("./route/authRoute");
dotenv.config();

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use(coockiParser());
// Use the user routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
