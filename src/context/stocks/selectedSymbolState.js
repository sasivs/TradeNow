import SelectedSymbolContext from "./selectedSymbolContext";
import { useState } from "react";

function SelectedSymbolState(props) {
  const [selectedSymbol, setSelectedSymbol] = useState({
    name: "AAPL",
    companyName: "Apple Inc.",
    securityName: "Apple Inc. - Common Stock",
  });
  const updateSelectedSymbol = (newState) => {
    setSelectedSymbol(newState);
  };
  return (
    <SelectedSymbolContext.Provider
      value={{ selectedSymbol, updateSelectedSymbol }}
    >
      {props.children}
    </SelectedSymbolContext.Provider>
  );
}

export default SelectedSymbolState;
