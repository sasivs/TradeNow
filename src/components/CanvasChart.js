import StockListingCard from "./StockListingCard";
import { Line } from "react-chartjs-2";
import { useState, useEffect, useContext } from "react";
import ChartZoom from "chartjs-plugin-zoom";
import axios from "axios";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import selectedSymbolContext from "../context/stocks/selectedSymbolContext";

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function CanvasChart() {
  const [chartData, setChartData] = useState({});
  const [symbols, setSymbols] = useState({});
  const { selectedSymbol, updateSelectedSymbol } = useContext(
    selectedSymbolContext
  );
  const [globalQuoteData, setGlobalQuoteData] = useState(selectedSymbol);
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
      .get("http://localhost:3001/api/stocks/intraday", {
        params: selectedSymbol,
      })
      .then((res) => {
        setChartData(res.data.formattedData);
      });
  }, [selectedSymbol]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/stocks/globalquote", {
        params: selectedSymbol,
      })
      .then((res) => {
        setGlobalQuoteData(res.data.data);
      });
  }, [selectedSymbol]);

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

  return (
    <div className="trading-chart-container">
      <div className="row">
        <div className="col-8 dashboard-container">
          {Object.keys(chartData).length > 0 && (
            <>
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
              <Line
                data={chartData}
                options={zoomOptions}
                plugins={[ChartZoom]}
              />
            </>
          )}
        </div>
        <div className="col stock-listing-card-container">
          {Object.keys(globalQuoteData).length > 0 && (
            <StockListingCard
              stockName={globalQuoteData.companyName}
              lastTradingDay={globalQuoteData.lastTradingDay}
              open={globalQuoteData.open}
              low={globalQuoteData.low}
              high={globalQuoteData.high}
              changePercent={globalQuoteData.changePercent}
              change={globalQuoteData.change}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CanvasChart;
