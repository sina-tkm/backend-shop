const { DataTypes } = require("sequelize");
const sequelize = require("../database /db");

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    required: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    required: true,
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  otpExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// Sync the model with the database
const syncModel = async () => {
  try {
    await User.sync({ alter: true });
    console.log("User model synced");
  } catch (error) {
    console.error("Error syncing model:", error);
  }
};

syncModel();

module.exports = User;
