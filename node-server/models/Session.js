const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../db");
const User = require("./User");


class Session extends Model {}
Session.init(
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
    session_id: {
        type: DataTypes.STRING,
        unique: true,
    },
    started_at: {
        type: DataTypes.DATE,
    },
    ended_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    last_request: {
        type: DataTypes.DATE,
    }
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
    Session.sync(syncOptions)
      .then(() => {
        console.log("Successfully synced Sessions");
      })
      .catch((error) => {
        console.error(error);
      });
  }
} else {
    Session.sync()
    .then(() => {
      console.log("Successfully synced Sessions");
    })
    .catch((error) => {
      console.error(error);
    });
}

module.exports = Session;
