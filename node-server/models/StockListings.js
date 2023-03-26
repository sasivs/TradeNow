const { sequelize, connectDB } = require("../db");
const { DataTypes, Model } = require("sequelize");

connectDB(sequelize);

class StockListing extends Model {}
StockListing.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    symbol: { type: DataTypes.STRING, unique: true, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    exchange: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["BSE", "NSE"]],
      },
    },
    series: { type: DataTypes.STRING, allowNull: false },
    dateOfListing: { type: DataTypes.DATEONLY },
    paidUpValue: {
      type: DataTypes.DOUBLE,
      validate: {
        min: 0,
      },
    },
    faceValue: {
      type: DataTypes.DOUBLE,
      validate: {
        min: 0,
      },
    },
    ISIN: { type: DataTypes.STRING, unique: true },
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
