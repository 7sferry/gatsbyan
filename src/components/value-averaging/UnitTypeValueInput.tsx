/************************
 * Made by [MR Ferry™]  *
 * on September 2023    *
 ************************/

import React from "react";

import { UnitType } from "../../types/DataTypes";

export const UnitTypeValueInput = () => {
  const [unitTypeValue, setUnitTypeValue] = React.useState("");

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
      {/*<option value={UnitType.UNIT}>Unit</option>*/}
    </select>
  );
};
