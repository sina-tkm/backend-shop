// server.js
const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./route/authRoute");
dotenv.config();

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);

// Use the user routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
