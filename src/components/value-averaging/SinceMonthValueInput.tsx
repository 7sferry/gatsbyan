/************************
 * Made by [MR Ferry™]  *
 * on September 2023    *
 ************************/

/************************
 * Made by [MR Ferry™]  *
 * on September 2023    *
 ************************/

import React from "react";

import { StockCacheInputProps } from "../../types/DataTypes";

export const SinceMonthValueInput = ({ stockCacheValue }: StockCacheInputProps) => {
  const [sinceMonthValue, setSinceMonthValue] = React.useState("");
  React.useEffect(() => {
    setSinceMonthValue(String(stockCacheValue.sinceMonth || ""));
  }, [stockCacheValue]);

  return (
    <select
      required={true}
      id="sinceMonth"
      name="sinceMonth"
      className="dropdown"
      style={{ width: "40%" }}
      onChange={(e) => setSinceMonthValue(e.target.value)}
      value={sinceMonthValue}
    >
      <option value="">-</option>
      <option value="01">Januari</option>
      <option value="02">Februari</option>
      <option value="03">Maret</option>
      <option value="04">April</option>
      <option value="05">Mei</option>
      <option value="06">Juni</option>
      <option value="07">Juli</option>
      <option value="08">Agustus</option>
      <option value="09">September</option>
      <option value="10">Oktober</option>
      <option value="11">November</option>
      <option value="12">Desember</option>
    </select>
  );
};
