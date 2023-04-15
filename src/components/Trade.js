import { Line } from "react-chartjs-2";
import { useState, useEffect, useContext } from "react";
import ChartZoom from "chartjs-plugin-zoom";
import axios from "axios";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import Form from "react-bootstrap/Form";
import StockDataTable from "./StockDataTable";
import SelectedSymbolContext from "../context/stocks/selectedSymbolContext";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Link } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Trade() {
  const [chartData, setChartData] = useState({});
  const [symbols, setSymbols] = useState({});
  const [timeseriesOption, setTimeSeriesOption] = useState("intraday");
  const [summaryRows, setSummaryRows] = useState();
  const { selectedSymbol, updateSelectedSymbol } = useContext(
    SelectedSymbolContext
  );
  const zoomOptions = {
    plugins: {
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          mode: "x",
        },
        pan: {
          enabled: true,
          mode: "x",
        },
      },
      legend: {
        labels: {
          color: "#fff",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 0,
          callback: function (value) {
            let label = this.getLabelForValue(value).split("at");
            return [label[0], label[1] || ""];
          },
          autoskip: true,
          maxTicksLimit: 60,
          color: "#fff",
        },
      },
      y: {
        ticks: {
          color: "#fff",
        },
      },
    },
  };

  const stylingOptions = { fontSize: "1rem" };

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/stocks/symbols")
      .then((res) => {
        if (!res.data.success) {
          return;
        }
        setSymbols(formatSymbols(res.data.symbols));
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  }, []);

  useEffect(() => {
    if (timeseriesOption === "") return;
    let call = "http://localhost:3001/api/stocks/" + timeseriesOption;
    axios.get(call, { params: selectedSymbol }).then((res) => {
      if (!res.data.success) return;
      setChartData(res.data.formattedData);
      setSummaryRows(
        res.data.formattedSummary.slice(0, 5).map((item) => (
          <tr>
            <td>{item.date}</td>
            <td>
              <strong>&#x20B9;</strong> {item.openPrice}
            </td>
            <td>
              <strong>&#x20B9;</strong> {item.closePrice}
            </td>
            <td>
              <strong>&#x20B9;</strong> {item.highPrice}
            </td>
            <td>
              <strong>&#x20B9;</strong> {item.lowPrice}
            </td>
          </tr>
        ))
      );
    });
  }, [timeseriesOption, selectedSymbol]);

  const formatSymbols = (sym) => {
    let symbols_obj = [];
    for (let i = 0; i < sym.length; i++) {
      symbols_obj.push({
        id: i,
        name: sym[i][0],
        companyName: sym[i][1],
        securityName: sym[i][2],
      });
    }
    return symbols_obj;
  };

  const formatResult = (item) => {
    return (
      <>
        <span style={{ display: "block", textAlign: "left" }}>
          {item.name} - {item.companyName}
        </span>
      </>
    );
  };

  const handleOnSelect = (item) => {
    updateSelectedSymbol(item);
  };

  const handleSelect = (element) => {
    setTimeSeriesOption(element.target.value);
  };

  return (
    <>
      <div className="trading-chart-container">
        <div className="row">
          <div className="col trade-container">
            {Object.keys(chartData).length > 0 && (
              <>
                <div className="row">
                  <div className="col-6">
                    <div id="search-box-container">
                      <ReactSearchAutocomplete
                        items={symbols}
                        placeholder="Search"
                        autoFocus
                        onSelect={handleOnSelect}
                        formatResult={formatResult}
                        styling={stylingOptions}
                      />
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="time-series-dropdown-container">
                      <Form.Select
                        aria-label="Time series"
                        className="form-dropdown-select"
                        onChange={handleSelect}
                      >
                        <option value={"intraday"}>Intraday</option>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                      </Form.Select>
                    </div>
                  </div>
                  <div className="col-3">
                    <Link
                      to={"/user/buy"}
                      value={"Buy"}
                      className="continue-btn btn"
                      style={{ margin: "0rem 1rem auto" }}
                    >
                      Buy
                    </Link>
                    <Link
                      to={"/user/sell"}
                      className="continue-btn btn"
                      style={{ margin: "0rem 1rem auto" }}
                    >
                      Sell
                    </Link>
                  </div>
                </div>
                <Line
                  data={chartData}
                  options={zoomOptions}
                  plugins={[ChartZoom]}
                />
              </>
            )}
          </div>
        </div>
      </div>
      <StockDataTable
        summaryRows={summaryRows}
        header={
          selectedSymbol.companyName +
          " - " +
          selectedSymbol.name +
          "  " +
          timeseriesOption
        }
      />
    </>
  );
}

export default Trade;
