/************************
 * Made by [MR Ferry™]  *
 * on September 2023    *
 ************************/

import React from "react";

export const StockNameValueInput = () => {
  const [stockNameValue, setStockNameValue] = React.useState("");

  return (
    <input
      type="text"
      name={"stockName"}
      id={"stockName"}
      className={"input-field"}
      autoComplete={"off"}
      required={true}
      onChange={(e) => setStockNameValue(e.target.value.toUpperCase())}
      value={stockNameValue}
    />
  );
};
