require("dotenv").config();
const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const { sequelize } = require("../db");
const crypto = require("crypto");
const fetchuser = require("../middleware/GetUser");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");
const ejs = require("ejs");
const fs = require("fs");
const pdf = require("html-pdf");
const { type } = require("os");

const generateToken = () => {
  return crypto.randomBytes(20).toString("hex");
};

router.get("/search", async (req, res) => {
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

router.get("/symbols", async (req, res) => {
  const stocklist = require("../models/StockListings");
  stocklist
    .findAll({
      raw: true,
      attributes: ["symbol", "companyName", "securityName"],
    })
    .then((result) => {
      result = [].concat(result.map((row) => Object.values(row)));
      return res.status(200).json({ success: true, symbols: result });
    })
    .catch((error) => {
      console.error("Internal Error", error);
      return res.status(500).json({ error: "Internal Error" });
    });
});

router.get("/intraday", async (req, res) => {
  await setTimeout(() => {}, 10000);
  const dateFormat = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const timeFormat = {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  };

  const formatSummaryData = (data) => {
    let formattedSummary = [];
    Object.keys(data["Time Series (5min)"]).forEach((key, index) => {
      formattedSummary[index] = {
        date: key,
        openPrice: data["Time Series (5min)"][key]["1. open"],
        closePrice: data["Time Series (5min)"][key]["4. close"],
        highPrice: data["Time Series (5min)"][key]["2. high"],
        lowPrice: data["Time Series (5min)"][key]["3. low"],
      };
    });
    return formattedSummary;
  };

  let apicall =
    "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&interval=5min&apikey=83MYQ3XE9KU8CPP1&symbol=";
  apicall = apicall + req.query.name;
  fetch(apicall)
    .then((result) => {
      result.json().then((data) => {
        const formattedData = {
          labels: Object.keys(data["Time Series (5min)"]).map((date) => {
            const dateObj = new Date(date);
            return `${dateObj.toLocaleDateString(
              "en-us",
              dateFormat
            )} at ${dateObj.toLocaleTimeString("en-us", timeFormat)}`;
          }),
          datasets: [
            {
              label: req.query.securityName,
              data: Object.entries(data["Time Series (5min)"]).map(
                (ele) => ele[1]["1. open"]
              ),
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        };
        const formattedSummary = formatSummaryData(data);
        return res
          .status(200)
          .json({ success: true, formattedData, formattedSummary });
      });
    })
    .catch((error) => {
      console.error("Internal Error ", error);
      return res.status(500).json({ error: "Internal Server error" });
    });
});

router.get("/globalquote", async (req, res) => {
  let apicall =
    "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&apikey=83MYQ3XE9KU8CPP1&symbol=";
  apicall = apicall + req.query.name;
  await setTimeout(() => {}, 10000);
  const dateFormat = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const formatGlobalQuoteData = (data) => {
    let formattedData = {};
    formattedData["symbol"] = data["Global Quote"]["01. symbol"];
    formattedData["open"] = data["Global Quote"]["02. open"];
    formattedData["high"] = data["Global Quote"]["03. high"];
    formattedData["low"] = data["Global Quote"]["04. low"];
    formattedData["lastTradingDay"] = new Date(
      data["Global Quote"]["07. latest trading day"]
    ).toLocaleDateString("en-us", dateFormat);
    formattedData["changePercent"] = data["Global Quote"]["10. change percent"];
    formattedData["companyName"] = req.query.companyName;
    formattedData["change"] = data["Global Quote"]["09. change"];
    return formattedData;
  };
  fetch(apicall)
    .then((result) => {
      result.json().then((data) => {
        return res
          .status(200)
          .json({ success: true, data: formatGlobalQuoteData(data) });
      });
    })
    .catch((error) => {
      console.error("Internal Error ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    });
});

router.get("/user-statistics", fetchuser, async (req, res) => {
  const trade = require("../models/Trade");
  const formatResult = (data) => {
    let formattedData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < data.length; i++) {
      const values = Object.values(data[i].dataValues);
      formattedData[values[1] - 1] = values[0];
    }
    return formattedData;
  };
  let investmentData = [];
  let returnsData = [];
  await trade
    .findAll({
      attributes: [
        [sequelize.literal('SUM("price")'), "investment"],
        [sequelize.fn("date_part", "month", sequelize.col('"time"')), "month"],
      ],
      where: {
        [Op.and]: [
          { user_id: req.user.id },
          { buy: true },
          sequelize.where(
            sequelize.fn("date_part", "year", sequelize.col('"time"')),
            req.query.year
          ),
        ],
      },
      group: [sequelize.fn("date_part", "month", sequelize.col('"time"'))],
    })
    .then((result) => {
      console.log(result);
      investmentData = formatResult(result);
    })
    .catch((error) => {
      console.error("Internal Server Error ", error);
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error" });
    });
  await trade
    .findAll({
      attributes: [
        [sequelize.literal('SUM("price")'), "returns"],
        [sequelize.fn("date_part", "month", sequelize.col('"time"')), "month"],
      ],
      where: {
        [Op.and]: [
          { user_id: req.user.id },
          { buy: false },
          sequelize.where(
            sequelize.fn("date_part", "year", sequelize.col('"time"')),
            req.query.year
          ),
        ],
      },
      group: [sequelize.fn("date_part", "month", sequelize.col('"time"'))],
    })
    .then((result) => {
      returnsData = formatResult(result);
    })
    .catch((error) => {
      console.error("Internal Server Error ", error);
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error" });
    });

  return res
    .status(200)
    .json({ success: true, data: { investmentData, returnsData } });
});

router.get("/daily", async (req, res) => {
  await setTimeout(() => {}, 10000);
  const dateFormat = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  let apicall =
    "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&apikey=83MYQ3XE9KU8CPP1&symbol=";
  apicall = apicall + req.query.name;
  fetch(apicall)
    .then((result) => {
      result.json().then((data) => {
        const formattedData = {
          labels: Object.keys(data["Time Series (Daily)"]).map((date) => {
            const dateObj = new Date(date);
            return `${dateObj.toLocaleDateString("en-us", dateFormat)}`;
          }),
          datasets: [
            {
              label: req.query.securityName,
              data: Object.entries(data["Time Series (Daily)"]).map(
                (ele) => ele[1]["1. open"]
              ),
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        };
        return res.status(200).json({ success: true, formattedData });
      });
    })
    .catch((error) => {
      console.error("Internal Error ", error);
      return res.status(500).json({ error: "Internal Server error" });
    });
});

router.get("/monthly", async (req, res) => {
  await setTimeout(() => {}, 10000);
  const dateFormat = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  let apicall =
    "https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&apikey=83MYQ3XE9KU8CPP1&symbol=";
  apicall = apicall + req.query.name;
  fetch(apicall)
    .then((result) => {
      result.json().then((data) => {
        const formattedData = {
          labels: Object.keys(data["Monthly Time Series"]).map((date) => {
            const dateObj = new Date(date);
            return `${dateObj.toLocaleDateString("en-us", dateFormat)}`;
          }),
          datasets: [
            {
              label: req.query.securityName,
              data: Object.entries(data["Monthly Time Series"]).map(
                (ele) => ele[1]["1. open"]
              ),
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        };
        return res.status(200).json({ success: true, formattedData });
      });
    })
    .catch((error) => {
      console.error("Internal Error ", error);
      return res.status(500).json({ error: "Internal Server error" });
    });
});

router.get("/weekly", async (req, res) => {
  await setTimeout(() => {}, 10000);
  const dateFormat = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  let apicall =
    "https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&apikey=83MYQ3XE9KU8CPP1&symbol=";
  apicall = apicall + req.query.name;
  fetch(apicall)
    .then((result) => {
      result.json().then((data) => {
        const formattedData = {
          labels: Object.keys(data["Weekly Time Series"]).map((date) => {
            const dateObj = new Date(date);
            return `${dateObj.toLocaleDateString("en-us", dateFormat)}`;
          }),
          datasets: [
            {
              label: req.query.securityName,
              data: Object.entries(data["Weekly Time Series"]).map(
                (ele) => ele[1]["1. open"]
              ),
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        };
        return res.status(200).json({ success: true, formattedData });
      });
    })
    .catch((error) => {
      console.error("Internal Error ", error);
      return res.status(500).json({ error: "Internal Server error" });
    });
});

router.get(
  "/details",
  async (req, res) => {
    const stockListings = require("../models/StockListings");
    stockListings
      .findOne({
        where: { symbol: req.query.symbol },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      })
      .then((stock) => {
        if (!stock) {
          return res
            .status(404)
            .json({ success: false, error: "Stock not found" });
        }
        return res.status(200).json({ success: true, stockDetails: stock });
      })
      .catch((error) => {
        console.error("Error: ", error);
        return res
          .status(500)
          .json({ success: false, error: "Internal Server error" });
      });
  }
);

router.get(
  "/holdings",
  fetchuser,  async (req, res) => {
    const trade = require("../models/Trade");
    const stockListings = require("../models/StockListings");
    stockListings
      .findOne({
        where: { symbol: req.query.symbol },
      })
      .then((stock) => {
        if (!stock) {
          return res
            .status(404)
            .json({ success: false, error: "Stock not found" });
        }
        trade
          .findAll({
            attributes: [
              [sequelize.literal('SUM("nstocks")'), "nstocks"],
              "buy",
            ],
            where: { user_id: req.user.id, stock_id: stock.id },
            group: [sequelize.col("buy")],
          })
          .then((rows) => {
            if (rows.length === 0)
              return res.status(200).json({ success: true, stockHoldings: 0 });
            let holdingsBought = 0,
              holdingsSold = 0;
            console.log(rows[0].dataValues.buy);
            if (rows[0].dataValues.buy === true) {
              holdingsBought = rows[0].dataValues.nstocks;
              if (rows.length > 1) {
                holdingsSold = rows[1].dataValues.nstocks;
              }
            } else {
              if (rows.length > 1) {
                holdingsBought = rows[1].dataValues.nstocks;
              }
              holdingsSold = rows[0].dataValues.nstocks;
            }
            holdingsBought = parseInt(holdingsBought);
            holdingsSold = parseInt(holdingsSold);
            console.log(holdingsBought, holdingsSold, typeof(holdingsBought), typeof(holdingsSold), holdingsSold > holdingsBought, rows);
            if (holdingsSold > holdingsBought){
              return res
                .status(404)
                .json({ success: false, error: "Invalid Trade Data" });
            }
            return res.status(200).json({
              success: true,
              stockHoldings: holdingsBought - holdingsSold,
            });
          });
      })
      .catch((error) => {
        console.error("Error: ", error);
        return res
          .status(500)
          .json({ success: false, error: "Internal Server Error" });
      });
  }
);

router.get("/latestprice", async (req, res) => {
  await setTimeout(() => {}, 10000);
  let apicall =
    "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&interval=1min&apikey=83MYQ3XE9KU8CPP1&symbol=";
  apicall = apicall + req.query.symbol;
  fetch(apicall)
    .then((result) => {
      result.json().then((data) => {
        let price = Object.entries(data["Time Series (1min)"])[0][1][
          "4. close"
        ];
        return res.status(200).json({ success: true, latestPrice: price });
      });
    })
    .catch((error) => {
      console.log("Error: ", error);
      return res
        .status(500)
        .json({ success: false, error: "Internal Server error" });
    });
});

router.post("/buyStocks", fetchuser, async (req, res) => {
  await setTimeout(() => {}, 10000);
  console.log(req.body);
  let apicall = "http://localhost:3001/api/stocks/latestprice?symbol=";
  apicall = apicall + req.body.symbol;
  let latestPrice = 0;
  const stockListings = require("../models/StockListings");
  const trade = require("../models/Trade");
  const User = require("../models/User");

  let reqStock;
  fetch(apicall)
    .then((result) => {
      result.json().then((data) => {
        console.log(data);
        if (!data.success) {
          return res
            .status(500)
            .json({ success: false, error: "Internal Server error" });
        }
        latestPrice = data.latestPrice;
        stockListings
          .findOne({
            where: {
              symbol: req.body.symbol,
            },
          })
          .then((stock) => {
            if (!stock)
              return res
                .status(400)
                .json({ success: false, error: "Invalid Stock" });
            reqStock = stock.dataValues;
            trade
              .create({
                user_id: req.user.id,
                stock_id: stock.id,
                nstocks: req.body.nstocks,
                time: new Date(),
                price: latestPrice,
                brokerage: (req.body.nstocks * latestPrice) / 100,
                hashKey: generateToken(),
                buy: true,
              })
              .then(async (trade) => {
                if (!trade)
                  return res
                    .status(500)
                    .json({ success: false, error: "Internal Server Error" });
                const template = fs.readFileSync(
                  "./public/templates/invoice.ejs",
                  "utf8"
                );
                let user = await User.findOne({
                  where: { id: req.user.id },
                });
                user = user.dataValues;
                const parameters = {
                  user: {
                    name: user.first_name,
                    DematNumber: user.demat_num,
                    email: user.email,
                  },
                  trade: {
                    hashKey: trade.dataValues.hashKey,
                  },
                  date: new Date().toLocaleDateString(),
                  items: [
                    {
                      companyName: reqStock.companyName,
                      securityName: reqStock.securityName,
                      nstocks: trade.dataValues.nstocks,
                      type: trade.dataValues.buy ? "Buy" : "Sell",
                      price: trade.dataValues.nstocks * trade.dataValues.price,
                      brokerage: trade.dataValues.brokerage,
                      total:
                        trade.dataValues.brokerage +
                        trade.dataValues.nstocks * trade.dataValues.price,
                    },
                  ],
                  subtotal: trade.dataValues.nstocks * trade.dataValues.price,
                  totalBrokerage: trade.dataValues.brokerage,
                  totalPrice:
                    trade.dataValues.brokerage +
                    trade.dataValues.nstocks * trade.dataValues.price,
                };
                const html = ejs.render(template, parameters);
                var options = { format: "Letter" };
                pdf.create(html, options).toBuffer((err, buffer) => {
                  if (err) {
                    console.log(err);
                  } else {
                    const transporter = nodemailer.createTransport({
                      service: "gmail",
                      auth: {
                        user: process.env.APP_GMAIL,
                        pass: process.env.APP_GMAIL_PASSWORD,
                      },
                    });
                    const htmlBody = `<div>
                                          <p>Dear user,</p>
                                          <p>Your transaction was successful. Thank you for our platform!</p>
                                          <p>You can find the invoice for the transaction attached.</p>
                                        \n\n
                                        <p>Thank you,</p>
                                        <p>TradeNow</p>
                                    </div> `;
                    const mailOptions = {
                      from: process.env.APP_GMAIL,
                      to: user.email,
                      subject: "Transaction Invoice",
                      html: htmlBody,
                      attachments: [
                        {
                          filename: "invoice.pdf",
                          content: buffer,
                        },
                      ],
                    };
                    transporter.sendMail(mailOptions, (error, info) => {
                      if (error) {
                        console.log(error);
                        return res
                          .status(500)
                          .json({
                            error: "Error sending email",
                            success: false,
                          });
                      } else {
                        console.log("Email sent: " + info.response);
                        return res.status(200).json({ success: true });
                      }
                    });
                  }
                });
              });
          });
      });
    })
    .catch((error) => {
      console.error("Error: ", error);
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error" });
    });
});

router.post("/sellStocks", fetchuser, async (req, res) => {
  await setTimeout(() => {}, 10000);
  let latestPrice = 0;
  const stockListings = require("../models/StockListings");
  const trade = require("../models/Trade");
  const User = require("../models/User");
  let reqStock;
  let apicall = "http://localhost:3001/api/stocks/holdings?symbol=";
  apicall = apicall + req.body.symbol;
  console.log(req.headers.authtoken);
  fetch(apicall, {
    headers: {
      authtoken: req.headers.authtoken,
    },
  }).then((result) => {
    result.json().then((data) => {
      console.log(data);
      if (!data.stockHoldings)
        return res.status(400).json({
          success: false,
          error: "No stocks are owned for this security.",
        });
      apicall = "http://localhost:3001/api/stocks/latestprice?symbol=";
      apicall = apicall + req.body.symbol;
      fetch(apicall)
        .then((result) => {
          result.json().then((data) => {
            if (!data.success) {
              return res
                .status(500)
                .json({ success: false, error: "Internal Server error" });
            }
            latestPrice = data.latestPrice;
            stockListings
              .findOne({
                where: {
                  symbol: req.body.symbol,
                },
              })
              .then((stock) => {
                if (!stock)
                  return res
                    .status(400)
                    .json({ success: false, error: "Invalid Stock" });
                reqStock = stock.dataValues;
                trade
                  .create({
                    user_id: req.user.id,
                    stock_id: stock.id,
                    nstocks: req.body.nstocks,
                    time: new Date(),
                    price: latestPrice,
                    brokerage: (req.body.nstocks * latestPrice) / 100,
                    hashKey: generateToken(),
                    buy: false,
                  })
                  .then(async (trade) => {
                    if (!trade)
                      return res.status(500).json({
                        success: false,
                        error: "Internal Server Error",
                      });
                    const template = fs.readFileSync(
                      "./public/templates/invoice.ejs",
                      "utf8"
                    );
                    let user = await User.findOne({
                      where: { id: req.user.id },
                    });
                    user = user.dataValues;
                    const parameters = {
                      user: {
                        name: user.first_name,
                        DematNumber: user.demat_num,
                        email: user.email,
                      },
                      trade: {
                        hashKey: trade.dataValues.hashKey,
                      },
                      date: new Date().toLocaleDateString(),
                      items: [
                        {
                          companyName: reqStock.companyName,
                          securityName: reqStock.securityName,
                          nstocks: trade.dataValues.nstocks,
                          type: trade.dataValues.buy ? "Buy" : "Sell",
                          price:
                            trade.dataValues.nstocks * trade.dataValues.price,
                          brokerage: trade.dataValues.brokerage,
                          total:
                            trade.dataValues.brokerage +
                            trade.dataValues.nstocks * trade.dataValues.price,
                        },
                      ],
                      subtotal:
                        trade.dataValues.nstocks * trade.dataValues.price,
                      totalBrokerage: trade.dataValues.brokerage,
                      totalPrice:
                        trade.dataValues.brokerage +
                        trade.dataValues.nstocks * trade.dataValues.price,
                    };
                    const html = ejs.render(template, parameters);
                    var options = { format: "Letter" };
                    pdf.create(html, options).toBuffer((err, buffer) => {
                      if (err) {
                        console.log(err);
                      } else {
                        const transporter = nodemailer.createTransport({
                          service: "gmail",
                          auth: {
                            user: process.env.APP_GMAIL,
                            pass: process.env.APP_GMAIL_PASSWORD,
                          },
                        });
                        const htmlBody = `<div>
                                              <p>Dear user,</p>
                                              <p>Your transaction was successful. Thank you for our platform!</p>
                                              <p>You can find the invoice for the transaction attached.</p>
                                            \n\n
                                            <p>Thank you,</p>
                                            <p>TradeNow</p>
                                        </div> `;
                        const mailOptions = {
                          from: process.env.APP_GMAIL,
                          to: user.email,
                          subject: "Transaction Invoice",
                          html: htmlBody,
                          attachments: [
                            {
                              filename: "invoice.pdf",
                              content: buffer,
                            },
                          ],
                        };
                        transporter.sendMail(mailOptions, (error, info) => {
                          if (error) {
                            console.log(error);
                            return res
                              .status(500)
                              .json({
                                error: "Error sending email",
                                success: false,
                              });
                          } else {
                            console.log("Email sent: " + info.response);
                            return res.status(200).json({ success: true });
                          }
                        });
                      }
                    });
                  });
              });
          });
        })
        .catch((error) => {
          console.error("Error: ", error);
          return res
            .status(500)
            .json({ success: false, error: "Internal Server Error" });
        });
    });
  });
});

router.get(
  "/userTotalStocks",
  fetchuser,  async (req, res) => {
    let query = `select (select SUM("nstocks") from "Trades" where "buy"='true' and "user_id"=${
      req.user.id
    }) - (select SUM("nstocks") from "Trades" where "buy"='false' and "user_id"=${
      req.user.id
    }) as "TotalStocks"`;
    sequelize
      .query(query)
      .then((results) => {
        if(!results) return res.status(400).json({error: "Invalid data"}); 
        return res
          .status(200)
          .json({ success: true, totalStocks: results[0][0]["TotalStocks"] });
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
