/************************
 * Made by [MR Ferry™]  *
 * on September 2023    *
 ************************/

import React from "react";
import { StockNameProps } from "../../types/DataTypes.ts";

export const StockNameValueInput = ({ onChange, stockName, stockCacheValueByName }: StockNameProps) => {
  return (
    <>
      <input
        type="text"
        list="stockNames"
        name={"stockName"}
        id={"stockName"}
        className={"input-field"}
        autoComplete={"off"}
        required={true}
        onChange={onChange}
        value={stockName}
      />
      {stockCacheValueByName && (
        <datalist id="stockNames">
          {Array.from(stockCacheValueByName.keys()).map((stockName) => (
            <option value={stockName} key={stockName} />
          ))}
        </datalist>
      )}
    </>
  );
};
