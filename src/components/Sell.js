import { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { useInput } from "../customHooks/useInput";
import StockListingCard from "./StockListingCard";
import selectedSymbolContext from "../context/stocks/selectedSymbolContext";
import axios from "axios";

function Sell(props) {
  const [dematNumber, setDematNumber] = useState("");
  const [billingName, setBillingName] = useState("");
  const [stockHoldings, setStockHoldings] = useState("");
  const { selectedSymbol, setSelectedSymbol } = useContext(
    selectedSymbolContext
  );
  const [hasStocks, setHasStocks] = useState(true);
  const [stockDetails, setStockDetails] = useState("");
  const [globalQuoteData, setGlobalQuoteData] = useState(selectedSymbol);
  const [latestPrice, setLatestPrice] = useState(0);
  const [securitiesPrice, setSecuritesPrice] = useState("-");
  const [brokerage, setBrokerage] = useState("-");
  const [totalPrice, setTotalPrice] = useState("-");
  const [tradeStatus, setTradeStatus] = useState(true);
  const [tradeCompleted, setTradeCompleted] = useState(false);
  const nstocksValidator = (nstocks) => {
    return {
      isValid:
        nstocks >= stockDetails.marketLot &&
        nstocks <= stockHoldings &&
        nstocks <= 1000,
      message: "",
    };
  };
  const {
    value: nstocks,
    isValid: nstocksIsValid,
    hasError: nstocksHasError,
    inputChangeHanlder: nstocksOnChangeHandler,
    inputOnBlurHandler: nstocksOnBlurHandler,
  } = useInput(nstocksValidator);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/users/dematnumber/", {
        headers: {
          authtoken: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (!res.data.success) return;
        setDematNumber(res.data.dematNumber);
      });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:3001/api/users/billingName/", {
      headers: {
        authtoken: localStorage.getItem("token"),
      },
    }).then((res) => {
      if (!res.data.success) return;
      setBillingName(res.data.billingName);
    });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/stocks/holdings/", {
        params: { symbol: selectedSymbol.name },
        headers: {
          authtoken: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (!res.data.success) return;
        if (res.data.stockHoldings === 0) {
          setHasStocks(false);
          return;
        }
        setStockHoldings(res.data.stockHoldings);
      });
  }, [selectedSymbol.name]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/stocks/details/", {
        params: { symbol: selectedSymbol.name },
      })
      .then((res) => {
        if (!res.data.success) return;
        setStockDetails(res.data.stockDetails);
      });
  }, [selectedSymbol.name]);

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
      .get("http://localhost:3001/api/stocks/latestprice", {
        params: {
          symbol: selectedSymbol.name,
        },
      })
      .then((res) => {
        if (!res.data.success) return;
        setLatestPrice(res.data.latestPrice);
      });
  }, [selectedSymbol.name]);

  useEffect(() => {
    if (nstocksIsValid && latestPrice) {
      setSecuritesPrice(nstocks * latestPrice);
      setBrokerage((nstocks * latestPrice) / 100);
      setTotalPrice((nstocks * latestPrice * 101) / 100);
    } else {
      setSecuritesPrice("-");
      setBrokerage("-");
      setTotalPrice("-");
    }
  }, [nstocksIsValid, latestPrice, nstocks]);

  const history = useHistory();

  const onSubmitHandler = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:3001/api/stocks/sellStocks", {
        symbol: selectedSymbol.name,
        nstocks: nstocks,
      }, {
        headers: {
          authtoken: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (!res.data.success) {
          setTradeStatus(false);
          return;
        }

        setTradeStatus(true);
        setTradeCompleted(true);
        setTimeout(() => {
          history.push("/user/home");
        }, 10000);
        return;
      });
  };

  return (
    <>
      <div className="sell-main-container">
        {!hasStocks && (
          <h5 className="error-label">
            You do not own any securities related to {stockDetails.securityName}
            .
          </h5>
        )}
        {tradeCompleted && tradeStatus && (
          <h5 className="info-label">Transaction is successfully completed.</h5>
        )}
        {!tradeCompleted && !tradeStatus && (
          <h5 className="error-label">
            Error in carrying out the transaction. Please try again.
          </h5>
        )}
        {hasStocks && !tradeCompleted && (
          <>
            <div className="row">
              <div className="col-4 stock-listing-card-container">
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
              <div className="col sell-now-container">
                <div className="sell-stock-header-container">
                  <h3 className="sell-stock-header">Sell Now</h3>
                </div>
                <div className="sell-now-details-container">
                  <label className="label">Billing Name</label>
                  <h5 className="sell-now-details">{billingName}</h5>
                </div>
                <div className="sell-now-details-container">
                  <label className="label">Demat Number</label>
                  <h5 className="sell-now-details">{dematNumber}</h5>
                </div>
                <div className="sell-now-details-container">
                  <label className="label">Security Name</label>
                  <h5 className="sell-now-details">
                    {stockDetails.securityName}
                  </h5>
                </div>
                <div className="sell-now-details-container">
                  <label className="label">Stock Price</label>
                  <h5 className="sell-now-details">
                    <strong>&#x20B9;</strong> {latestPrice}
                  </h5>
                </div>
                <div className="buy-now-details-container">
                  <label className="label">Securities Price</label>
                  <h5 className="buy-now-details">
                    <strong>&#x20B9;</strong> {securitiesPrice}
                  </h5>
                </div>
                <div className="buy-now-details-container">
                  <label className="label">Brokerage</label>
                  <h5 className="buy-now-details">
                    <strong>&#x20B9;</strong> {brokerage}
                  </h5>
                </div>
                <div className="buy-now-details-container">
                  <label className="label">Total Price</label>
                  <h5 className="buy-now-details">
                    <strong>&#x20B9;</strong> {totalPrice}
                  </h5>
                </div>
                <div className="form-container buy-form-container">
                  <form onSubmit={onSubmitHandler}>
                    <div className="sell-now-details-container">
                      <label className="label">Stock Quantity</label>
                      <input
                        type="number"
                        step={1}
                        min={stockDetails.marketLot}
                        max={Math.max(1000, stockHoldings)}
                        value={nstocks}
                        onChange={nstocksOnChangeHandler}
                        onBlur={nstocksOnBlurHandler}
                        className="stock-quantity-input"
                      />
                    </div>
                    <br />
                    <input
                      type="submit"
                      value={"Sell"}
                      className="sell-btn btn"
                    />
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Sell;
