const { sequelize, connectDB } = require("../db");
const { DataTypes, Model } = require("sequelize");
const User = require("./User");

connectDB(sequelize);

class TradeVerCodes extends Model {}
TradeVerCodes.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        user_id: {
          type: DataTypes.INTEGER,
          references: {
            model: User,
            key: "id",
          },
        },
        code: {
            type: DataTypes.BIGINT,
            validate: {
                len: [6, 6],
            },
        },
        used: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    }, {
        sequelize,
    }
)


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
      TradeVerCodes
        .sync(syncOptions)
        .then(() => {
          console.log("TradeVerCodes table updated successfully");
        })
        .catch((error) => {
          console.error("TradeVerCodes table is not created: ", error);
        });
    }
  } else {
    TradeVerCodes
      .sync()
      .then(() => {
        console.log("TradeVerCodes table created successfully");
      })
      .catch((error) => {
        console.error("TradeVerCodes table is not created: ", error);
      });
  }
  
  module.exports = TradeVerCodes;
  