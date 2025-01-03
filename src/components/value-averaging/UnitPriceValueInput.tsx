/************************
 * Made by [MR Ferry™]  *
 * on September 2023    *
 ************************/

import React from "react";
import { StockCacheInputProps } from "../../types/DataTypes";
import { onChangeRupiah } from "../../utils/VcaUtils";

export const UnitPriceValueInput = ({ stockCacheValueByName, stockName }: StockCacheInputProps) => {
  const [unitPriceValue, setUnitPriceValue] = React.useState("");
  React.useEffect(() => {
    let stockCacheValue = stockCacheValueByName.get(stockName);
    setUnitPriceValue(String(stockCacheValue?.currentUnitPrice || ""));
  }, [stockCacheValueByName, stockName]);

  return (
    <input
      type="text"
      name={"currentUnitPrice"}
      id={"currentUnitPrice"}
      className={"input-field"}
      placeholder={"Rp"}
      autoComplete={"off"}
      onChange={(e) => setUnitPriceValue(onChangeRupiah(e))}
      value={unitPriceValue}
      required={true}
    />
  );
};
