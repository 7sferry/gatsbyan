/************************
 * Made by [MR Ferry™]  *
 * on September 2023    *
 ************************/

import React from "react";

import { StockCacheInputProps } from "../../types/DataTypes";

export const TotalLotValueInput = ({ stockCacheValueByName, stockKey }: StockCacheInputProps) => {
  const [totalLotValue, setTotalLotValue] = React.useState("");
  React.useEffect(() => {
    let stockCacheValue = stockCacheValueByName.get(stockKey);
    setTotalLotValue(String(stockCacheValue?.totalLot || ""));
  }, [stockCacheValueByName, stockKey]);

  return (
    <input
      type="number"
      name="totalLot"
      id="totalLot"
      className="input-field"
      style={{ width: "40%" }}
      min={0}
      placeholder="total"
      required={true}
      onChange={(e) => setTotalLotValue(e.target.value)}
      value={totalLotValue}
    />
  );
};
