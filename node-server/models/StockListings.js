const { sequelize, connectDB } = require("../db");
const { DataTypes, Model } = require("sequelize");

connectDB(sequelize);

class StockListing extends Model {}
StockListing.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    symbol: { type: DataTypes.STRING, unique: true, allowNull: false },
    companyName: { type: DataTypes.STRING, allowNull: false },
    securityName: { type: DataTypes.STRING, allowNull: false },
    exchange: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["NASDAQ", "NYSE"]],
      },
    },
    marketLot: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
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
    console.log("Please provide an option");
  } else {
    const syncOptions = {};
    syncOptions[option] = true;
    StockListing.sync(syncOptions)
      .then(() => {
        console.log("StockListing table updated successfully");
      })
      .catch((error) => {
        console.error("StockListing table is not created ", error);
      });
  }
} else {
  StockListing.sync()
    .then(() => {
      console.log("StockListing table created successfully");
    })
    .catch((error) => {
      console.error("StockListing table is not created ", error);
    });
}

module.exports = StockListing;
