const { sequelize, connectDB } = require("../db");
const { DataTypes, Model } = require("sequelize");
const User = require("./User");
const StockListing = require("./StockListings");

connectDB(sequelize);

class Trade extends Model {}
Trade.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    stock_id: {
      type: DataTypes.INTEGER,
      references: {
        model: StockListing,
        key: "id",
      },
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    brokerage: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    hashKey: {
      type: DataTypes.STRING,
      unique: true,
    },
    nstocks: {
      type: DataTypes.INTEGER,
    },
    buy: {
      type: DataTypes.BOOLEAN,
    },
  },
  { sequelize }
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
    Trade.sync(syncOptions)
      .then(() => {
        console.log("Trade table updated successfully");
      })
      .catch((error) => {
        console.error("Trade table is not created: ", error);
      });
  }
} else {
  Trade.sync()
    .then(() => {
      console.log("Trade table created successfully");
    })
    .catch((error) => {
      console.error("Trade table is not created: ", error);
    });
}

module.exports = Trade;
