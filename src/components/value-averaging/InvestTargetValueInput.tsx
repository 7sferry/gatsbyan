/************************
 * Made by [MR Ferry™]  *
 * on September 2023    *
 ************************/

import React from "react";
import { onChangeRupiah } from "../../utils/GatsbyanUtils";
import { StockCacheInputProps } from "../../types/DataTypes";

export const InvestTargetValueInput = ({ stockCacheValueByName, stockKey }: StockCacheInputProps) => {
  const [investTargetValue, setInvestTargetValue] = React.useState("");
  React.useEffect(() => {
    let stockCacheValue = stockCacheValueByName.get(stockKey);
    setInvestTargetValue(String(stockCacheValue?.monthlyInvestTarget || ""));
  }, [stockCacheValueByName, stockKey]);

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
