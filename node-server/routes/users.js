require("dotenv").config();

const express = require("express");
const fetchuser = require("../middleware/GetUser");

const router = express.Router();

router.put("/update", async (req, res) => {
  console.log(req.body);
  const user = require("../models/User");
  user
    .update(req.body.data, {
      returning: true,
      where: req.body.where,
    })
    .then(([nrows, rows]) => {
      if (nrows === 0) {
        return res.status(400).json({ success: false });
      }
      return res.status(200).json({ success: true, rows });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    });
});

router.delete("/delete", async (req, res) => {
  const user = require("../models/User");
  user
    .destroy({
      where: req.query,
    })
    .then((results) => {
      if (results !== 0) {
        return res.status(200).json({ success: true });
      }
      return res.status(400).json({ success: false });
    })
    .catch((error) => {
      console.error("Error in deleting ", error);
      return res.status(500).json({ error: "Internal Server error" });
    });
});

router.delete("/bankdetails/delete", async (req, res) => {
  const bankDetail = require("../models/BankDetail");
  console.log(req.query);
  bankDetail
    .destroy({
      where: req.query,
    })
    .then((results) => {
      if (results !== 0) {
        return res.status(200).json({ success: true });
      }
      return res.status(400).json({ success: false });
    })
    .catch((error) => {
      console.error("Error in deleting ", error);
      return res.status(500).json({ error: "Internal Server error" });
    });
});

router.post("/bankdetails", async (req, res) => {
  const bankDetail = require("../models/BankDetail");
  bankDetail
    .create(req.body)
    .then((row) => {
      console.log(row);
      return res.status(200).json({ success: true });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ error: "Internal Server error" });
    });
});

router.get(
  "/dematnumber",
  fetchuser, async (req, res) => {
    const user = require("../models/User");
    user
      .findOne({
        where: { id: req.user.id },
      })
      .then((user) => {
        if (!user) {
          return res
            .status(400)
            .json({ success: false, error: "Invalid Access" });
        }
        return res
          .status(200)
          .json({ success: true, dematNumber: user.demat_num });
      })
      .catch((error) => {
        console.error("Error: ", error);
        return res
          .status(500)
          .json({ success: false, error: "Internal Server Error" });
      });
  }
);

router.get(
  "/billingname",
  fetchuser,  async (req, res) => {
    const user = require("../models/User");
    user
      .findOne({
        where: { id: req.user.id },
      })
      .then((user) => {
        if (!user) {
          return res
            .status(400)
            .json({ success: false, error: "Invalid Access" });
        }
        let name = user.first_name;
        if (user.last_name) name += " " + user.last_name;
        return res.status(200).json({ success: true, billingName: name });
      })
      .catch((error) => {
        console.error("Error: ", error);
        return res
          .status(500)
          .json({ success: false, error: "Internal Server Error" });
      });
  }
);

module.exports = router;
