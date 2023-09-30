/************************
 * Made by [MR Ferry™]  *
 * on September 2023    *
 ************************/

/************************
 * Made by [MR Ferry™]  *
 * on September 2023    *
 ************************/

import React from "react";

import { StockCacheInputProps, UnitType } from "../../types/DataTypes";

export const UnitTypeValueInput = ({ stockCacheValue }: StockCacheInputProps) => {
  const [unitTypeValue, setUnitTypeValue] = React.useState("");
  React.useEffect(() => {
    setUnitTypeValue(String(stockCacheValue.unitType || ""));
  }, [stockCacheValue]);

  return (
    <select
      onChange={(e) => setUnitTypeValue(e.target.value)}
      value={unitTypeValue}
      id="unitType"
      name="unitType"
      className="dropdown"
      style={{ width: "25%" }}
    >
      <option value={UnitType.LOT}>Lot</option>
      <option value={UnitType.UNIT}>Unit</option>
    </select>
  );
};
