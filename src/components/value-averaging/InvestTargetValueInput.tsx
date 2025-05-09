/************************
 * Made by [MR Ferry™]  *
 * on September 2023    *
 ************************/

import React from "react";
import { StockCacheInputProps } from "../../types/DataTypes";
import { onChangeRupiah } from "../../utils/VcaUtils";

export const InvestTargetValueInput = ({ stockCacheValueByName, stockName }: StockCacheInputProps) => {
  const [investTargetValue, setInvestTargetValue] = React.useState("");
  React.useEffect(() => {
    let stockCacheValue = stockCacheValueByName.get(stockName);
    setInvestTargetValue(String(stockCacheValue?.monthlyInvestTarget || ""));
  }, [stockCacheValueByName, stockName]);

  return (
    <input
      type="text"
      name={"monthlyInvestTarget"}
      id={"monthlyInvestTarget"}
      className={"input-field"}
      placeholder={"Rp"}
      autoComplete={"off"}
      onChange={(e) => setInvestTargetValue(onChangeRupiah(e))}
      value={investTargetValue}
      required={true}
    />
  );
};
