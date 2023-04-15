function StockDataTable(props) {
  return (
    <div>
      <div className="stock-data-container">
        <div className="stock-data-header-container">
          <h4 className="stock-data-header">{props.header}</h4>
        </div>
        <table className="stock-data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Open Price</th>
              <th>Closing Price</th>
              <th>High</th>
              <th>Low</th>
            </tr>
          </thead>
          <tbody>{props.summaryRows}</tbody>
        </table>
      </div>
    </div>
  );
}

export default StockDataTable;
