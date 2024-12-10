const { DataTypes } = require("sequelize");
const sequelize = require("../database /db");

const Product = sequelize.define(
  "Product",
  {
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
    },
    productDescription: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.INTEGER,
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
    image: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true, // This should be in the options object
  }
);

module.exports = Product;

// Product.sync({ alter: true })
//   .then(() => {
//     console.log("Synced Models");
//   })s
//   .catch((err) => {
//     console.log(err);
//   });
module.exports = Product;
