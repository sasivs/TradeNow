const { DataTypes, Model } = require("sequelize");
const { connectDB, sequelize } = require("../db");

connectDB(sequelize);

class User extends Model {}
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    middle_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isIn: [["Male", "Female", "Other"]],
      },
    },
    pan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    aadhar: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [12, 12],
      },
    },
    mobile: {
      type: DataTypes.STRING,
      allownull: true,
      validate: {
        len: [10, 10],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: 8,
      },
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    demat_num: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        len: [16, 16],
      },
    },
    emailVerificationCode: {
      type: DataTypes.STRING,
      allowNull: true,
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
    console.log("Invalid Arguments");
    console.log("Failing.");
  } else {
    console.log(option);
    const syncOptions = {};
    syncOptions[option] = true
    User
      .sync(syncOptions)
      .then(() => {
        console.log("User table updated successfully");
      })
      .catch((error) => {
        console.error("User table is not updated: ", error);
      });
  }
} else {
  User
    .sync()
    .then(() => {
      console.log("User table created successfully");
    })
    .catch((error) => {
      console.error("User table is not created: ", error);
    });
}

module.exports = User;
