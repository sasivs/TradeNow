import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import increaseImg from "../assets/images/increase.svg";
import decreaseImg from "../assets/images/decrease.svg";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function BarChart() {
  const [investmentData, setInvestmentData] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [returnsData, setreturnsData] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#fff",
        },
      },
      title: {
        display: true,
        text: "Investment and returns chart",
        color: "#fff",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#fff",
        },
      },
      y: {
        ticks: {
          color: "#fff",
        },
      },
    },
    barThickness: 8,
    maxBarThickness: 8,
    barPercentage: 0.4,
    categoryPercentage: 0.8,
    borderRadius: 20,
  };

  const sum = (array) => {
    let total = 0;
    for (let i=0; i<array.length; i++){
      total+=array[i];
    }
    total = total.toFixed(2);
    return total;
  }

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

  const data = {
    labels,
    datasets: [
      {
        label: "Investment",
        color: "#fff",
        data: investmentData,
        backgroundColor: "rgb(255, 255, 255)",
        borderWidth: 1,
      },
      {
        label: "Returns",
        data: returnsData,
        backgroundColor: "rgb(255, 209, 37)",
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className="user-statistics-container">
      <div className="row user-statistics-barchart-row">
        <div
          className="col-9 user-statistics-barchart-container"
          style={{ height: "100%" }}
        >
          <Bar options={options} data={data} />
        </div>
        <div className="col">
          <div className="summary-statistics-header">
            <h3 className="summary-statistics-header-title">Summary</h3>
          </div>
          <div className="investments-card">
            <div className="row">
              <h5>Investments</h5>
              <div className="col-2">
                <img src={decreaseImg} alt={"Investments"} />
              </div>
              <div className="col">
                <strong>&#x20B9;</strong> {sum(investmentData)}
              </div>
            </div>
          </div>
          <div className="returns-card">
            <div className="row">
              <h5>Returns</h5>
              <div className="col-2">
                <img src={increaseImg} alt={"returns"} />
              </div>
              <div className="col">
                <strong>&#x20B9;</strong> {sum(returnsData)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BarChart;
