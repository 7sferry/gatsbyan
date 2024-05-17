/************************
 * Made by [MR Ferry™]  *
 * on September 2023    *
 ************************/

import React from "react";

import { StockCacheInputProps } from "../../types/DataTypes";

export const StockNameValueInput = ({ stockCacheValue }: StockCacheInputProps) => {
  const [stockNameValue, setStockNameValue] = React.useState("");
  React.useEffect(() => {
    setStockNameValue(String(stockCacheValue.stockName || ""));
  }, [stockCacheValue]);

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
