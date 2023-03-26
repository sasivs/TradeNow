require("dotenv").config();

const express = require("express");
const router = express.Router();

router.get("/search", async (req, res) => {
  console.log(req.query);
  const stocklist = require("../models/StockListings");
  stocklist
    .findAll({
      where: req.query,
      attributes: { exclude: ["createdAt", "updatedAt"] },
    })
    .then((results) => {
      return res.status(200).json({ success: true, results: results });
    })
    .catch((error) => {
      console.error("Internal Error ", error);
      return res.status(500).json({ error: "Internal error" });
    });
});

module.exports = router;
