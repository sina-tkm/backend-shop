const { DataTypes } = require("sequelize");
const sequelize = require("../database /db");

const Members = sequelize.define("Members", {
  idName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  lifeName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  studenntId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  otpExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  isVerifiedEmail: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: "user",
  },
});

// Sync the model with the database
const syncModel = async () => {
  try {
    await Members.sync({ alter: true });
    console.log("members model synced");
  } catch (error) {
    console.error("Error syncing model:", error);
  }
};

syncModel();

module.exports = Members;
