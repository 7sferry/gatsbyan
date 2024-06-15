/************************
 * Made by [MR Ferry™]  *
 * on September 2023    *
 ************************/

import React from "react";
import { onChangeRupiah } from "../../utils/GatsbyanUtils";
import { StockCacheInputProps } from "../../types/DataTypes";

export const UnitPriceValueInput = ({ stockCacheValueByName, stockKey }: StockCacheInputProps) => {
  const [unitPriceValue, setUnitPriceValue] = React.useState("");
  React.useEffect(() => {
    let stockCacheValue = stockCacheValueByName.get(stockKey);
    setUnitPriceValue(String(stockCacheValue?.currentUnitPrice || ""));
  }, [stockCacheValueByName, stockKey]);

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
