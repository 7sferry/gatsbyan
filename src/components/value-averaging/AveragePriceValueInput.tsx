/************************
 * Made by [MR Ferry™]  *
 * on April 2026        *
 ************************/

import React from "react";
import { StockCacheInputProps } from "../../types/DataTypes";
import { onChangeRupiah } from "../../utils/VcaUtils";

export const AveragePriceValueInput = ({ stockCacheValueByName, stockName }: StockCacheInputProps) => {
  const [averagePriceValue, setAveragePriceValue] = React.useState("");
  React.useEffect(() => {
    let stockCacheValue = stockCacheValueByName.get(stockName);
    setAveragePriceValue(String(stockCacheValue?.averagePrice || ""));
  }, [stockCacheValueByName, stockName]);

  return (
    <input
      type="text"
      name={"averagePrice"}
      id={"averagePrice"}
      className={"vca-input"}
      placeholder={"Rp"}
      autoComplete={"off"}
      onChange={(e) => setAveragePriceValue(onChangeRupiah(e))}
      value={averagePriceValue}
      required={true}
    />
  );
};
