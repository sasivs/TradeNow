const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../db");
const User = require("./User");

class BankDetail extends Model {}
BankDetail.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    bank_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ifsc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bankHolderName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accountNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNumeric: true,
      },
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
    console.error("Please provide valid arguments");
  } else {
    const syncOptions = {};
    syncOptions[option] = true;
    BankDetail.sync(syncOptions)
      .then(() => {
        console.log("Successfully synced bank details");
      })
      .catch((error) => {
        console.error(error);
      });
  }
} else {
  BankDetail.sync()
    .then(() => {
      console.log("Successfully synced bank details");
    })
    .catch((error) => {
      console.error(error);
    });
}

module.exports = BankDetail;
