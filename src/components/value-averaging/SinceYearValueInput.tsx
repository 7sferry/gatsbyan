/************************
 * Made by [MR Ferry™]  *
 * on September 2023    *
 ************************/

import React from "react";

import { StockCacheInputProps } from "../../types/DataTypes";

export const SinceYearValueInput = ({ stockCacheValueByName, stockKey }: StockCacheInputProps) => {
  const [sinceYearValue, setSinceYearValue] = React.useState("");
  React.useEffect(() => {
    let stockCacheValue = stockCacheValueByName.get(stockKey);
    setSinceYearValue(String(stockCacheValue?.sinceYear || ""));
  }, [stockCacheValueByName, stockKey]);

  return (
    <input
      type="number"
      name="sinceYear"
      id="sinceYear"
      className="input-field"
      placeholder="year"
      style={{ width: "25%" }}
      min={1970}
      max={3000}
      required={true}
      onChange={(e) => setSinceYearValue(e.target.value)}
      value={sinceYearValue}
    />
  );
};
