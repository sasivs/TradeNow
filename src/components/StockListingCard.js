function StockListingCard(props) {
  return (
    <div className="stock-listing-card">
      <div className="stock-listing-card__header">
        <h3 className="stock-listing-card__header__title">{props.stockName}</h3>
      </div>
      <div className="stock-listing-card__content">
        <table id="stock-listing-card-table">
          <tbody>
            <tr>
              <th>Last Trading Day</th>
              <td>{props.lastTradingDay}</td>
            </tr>
            <tr>
              <th>Open</th>
              <td>
                <strong>&#x20B9;</strong> {props.open}
              </td>
            </tr>
            <tr>
              <th>High</th>
              <td>
                <strong>&#x20B9;</strong> {props.high}
              </td>
            </tr>
            <tr>
              <th>Low</th>
              <td>
                <strong>&#x20B9;</strong> {props.low}
              </td>
            </tr>
            <tr>
              <th>Change</th>
              <td>{props.change}</td>
            </tr>
            <tr>
              <th>Change(%)</th>
              <td>{props.changePercent}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StockListingCard;
