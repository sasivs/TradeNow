import DashboardCards from "./DashboardCards";
import investmentImg from "../assets/images/investment.png";
import profitsImg from "../assets/images/profits.png";
import lossImg from "../assets/images/loss.png";
import stocksImg from "../assets/images/stocks.png";
import CanvasChart from "./CanvasChart";
import BarChart from "./BarChart";

import axios from "axios";
import { useEffect, useState } from "react";

import "./dashboard.css";

function DashboardMainDiv() {
  const [investmentData, setInvestmentData] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [returnsData, setreturnsData] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);

  const [totalStocks, setTotalStocks] = useState(0);

  const sum = (array) => {
    let total = 0;
    for (let i = 0; i < array.length; i++) {
      total += array[i];
    }
    total = total.toFixed(2);
    return total;
  };
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/stocks/user-statistics", {
        params: {
          year: 2023,
        },
        headers: {
          authtoken: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setInvestmentData(res.data.data.investmentData);
        setreturnsData(res.data.data.returnsData);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/stocks/userTotalStocks", {
        headers: {
          authtoken: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setTotalStocks(res.data.totalStocks);
      });
  }, []);

  return (
    <div>
      <div className="highlights-container">
        <div className="row">
          <div className="col highlights-col">
            <DashboardCards
              src={investmentImg}
              alt={"Investment"}
              description={sum(investmentData)}
              title={"Investment"}
            />
          </div>
          <div className="col highlights-col">
            <DashboardCards
              src={profitsImg}
              alt={"Returns"}
              description={sum(returnsData)}
              title={"Profits"}
            />
          </div>
          <div className="col highlights-col">
            <DashboardCards
              src={lossImg}
              alt={"Loss"}
              description={"-"}
              title={"Loss"}
            />
          </div>
          <div className="col highlights-col">
            <DashboardCards
              src={stocksImg}
              alt={"Stocks held"}
              description={totalStocks}
              title={"Stocks"}
            />
          </div>
        </div>
      </div>
      <CanvasChart />
      <BarChart />
    </div>
  );
}

export default DashboardMainDiv;
