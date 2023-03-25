const { DataTypes, Model } = require("sequelize");
const { connectDB, sequelize } = require("../db");
const User = require("./User");

connectDB(sequelize);

class ResetPassword extends Model {}
ResetPassword.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    verificationCode: {
      type: DataTypes.BIGINT,
      validate: {
        len: [6, 6],
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    oldPassword: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        min: 8,
      },
    },
    newPassword: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        min: 8,
      },
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
  }
);

if (process.argv.length > 2) {
  const option = process.argv[2];
  const options = ["alter", "force"];
  if (!options.includes(option)) {
    console.log("Invalid Arguments");
    console.log("Failing.");
  } else {
    console.log(option);
    const syncOptions = {};
    syncOptions[option] = true;
    sequelize
      .sync(syncOptions)
      .then(() => {
        console.log("Reset Password table updated successfully");
      })
      .catch((error) => {
        console.error("Reset Password table is not created: ", error);
      });
  }
} else {
  sequelize
    .sync()
    .then(() => {
      console.log("Reset Password table created successfully");
    })
    .catch((error) => {
      console.error("Reset Password table is not created: ", error);
    });
}

module.exports = ResetPassword;
