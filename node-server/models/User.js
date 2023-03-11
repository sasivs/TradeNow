const { DataTypes, Model } = require("sequelize");
const { connectDB, sequelize } = require("../db");

connectDB(sequelize);

class User extends Model {}
User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  middle_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dob: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [["Male", "Female", "Other"]],
    },
  },
  pan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  aadhar: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [12, 12],
    },
  },
  mobile: {
    type: DataTypes.STRING,
    allownull: false,
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
  email_verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  demat_num: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [16, 16],
    },
  },
},
{
    sequelize,
});

sequelize
  .sync()
  .then(() => {
    console.log("User table created successfully");
  })
  .catch((error) => {
    console.error("User table is not created: ", error);
  });

module.exports = User;
