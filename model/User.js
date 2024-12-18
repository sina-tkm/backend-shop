const { DataTypes } = require("sequelize");
const sequelize = require("../database /db");

const User = sequelize.define("User", {
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
    required: true,
    unique: true,
    validate: {
      noSpaces(value) {
        if (/\s/.test(value)) {
          throw new Error("Username cannot contain spaces");
        }
      },
      len: {
        args: [3, 50],
        msg: "Username must be between 3 and 50 characters",
      },
    },
  },
  name: {
    type: DataTypes.STRING,
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
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "user",
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

// Sync the model with the database
// User.sync({ alter: true })
//   .then(() => {
//     console.log("Synced Models");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

module.exports = User;
