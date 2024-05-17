/************************
 * Made by [MR Ferry™]  *
 * on September 2023    *
 ************************/

import React from "react";
import { onChangeRupiah } from "../../utils/GatsbyanUtils";
import { StockCacheInputProps } from "../../types/DataTypes";

export const InvestTargetValueInput = ({ stockCacheValue }: StockCacheInputProps) => {
  const [investTargetValue, setInvestTargetValue] = React.useState("");
  React.useEffect(() => {
    setInvestTargetValue(String(stockCacheValue.monthlyInvestTarget || ""));
  }, [stockCacheValue]);

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
