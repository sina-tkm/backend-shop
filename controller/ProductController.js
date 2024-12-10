const Product = require("../model/Product");

exports.createProduct = async (req, res) => {
  const { ProductName, ProductDescription, Price, Quantity } = req.body;
  const image = req.file ? req.file.path : null;

  if (!ProductName || !ProductDescription || !Price || !Quantity) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const product = await Product.create({
      productName: ProductName,
      productDescription: ProductDescription,
      price: Price,
      quantity: Quantity,
      image: image,
    });
    return res
      .status(201)
      .json({ message: "Product created successfully", product });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating product",
      error,
    });
  }
};
