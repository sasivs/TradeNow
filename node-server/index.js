const express = require("express");
const cors = require("cors");
const { connectDB, sequelize } = require("./db");
const bodyParser = require("body-parser");

const app = express();
const path = require("path");

connectDB(sequelize);

const tradenow_dir = path.resolve(__dirname, "..");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use("/static", express.static(path.join(tradenow_dir, "public")));

app.get("/home", (req, res) => {
  console.log("here");
});

app.use("/api/auth", require("./routes/auth"));

app.use("/api/stocks", require("./routes/stocks"));

app.use("/api/users", require("./routes/users"));

app.listen(3001, function () {
  console.log("Server is listening at http://localhost:3001");
});
