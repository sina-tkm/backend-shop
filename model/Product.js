const { DataTypes } = require("sequelize");
const sequelize = require("../database /db");

const Product = sequelize.define("Product", {
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
    required: true,
    unique: true,
    validate: {
      noSpaces(value) {
        if (/\s/.test(value)) {
          throw new Error("Product name cannot contain spaces");
        }
      },
      len: {
        args: [3, 50],
        msg: "Product name must be between 3 and 50 characters",
      },
    },
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
});

// Product.sync({ alter: true })
//   .then(() => {
//     console.log("Synced Models");
//   })
//   .catch((err) => {
//     console.log(err);
//   });
module.exports = Product;
