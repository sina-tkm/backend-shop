const express = require("express");
const { createProduct } = require("../controller/ProductController");
const router = express.Router();

const { upload } = require("../utils/productUtils");

router.post("/create", upload.single("image"), createProduct);

// Directly export router here
module.exports = router;
