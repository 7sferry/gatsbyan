/************************
 * Made by [MR Ferry™]  *
 * on Januari 2025      *
 ************************/

import React from "react";
import { StockData, UnitType } from "../../types/DataTypes.ts";
import { StockNameValueInput } from "./StockNameValueInput.tsx";
import { SinceMonthValueInput } from "./SinceMonthValueInput.tsx";
import { SinceYearValueInput } from "./SinceYearValueInput.tsx";
import { TotalLotValueInput } from "./TotalLotValueInput.tsx";
import { UnitPriceValueInput } from "./UnitPriceValueInput.tsx";
import { InvestTargetValueInput } from "./InvestTargetValueInput.tsx";
import { ValueAveragingStockCalculator } from "../../utils/ValueAveragingStockCalculator.tsx";
import { getValueAveragingFormResult } from "./ValueAveragingFormResult.tsx";
import ReactDOM from "react-dom/client";

export function ValueAveragingForm() {
  const storageKey = "vcaList";
  const storage = typeof window !== "undefined" ? window.localStorage : null;
  const [stockCacheValueByName, setStockCacheValueByName] = React.useState(getStockCacheValue());
  const [stockName, setStockName] = React.useState("");
  const element: React.RefObject<HTMLDivElement> = React.createRef();

  function getStockCacheValue(): Map<string, StockData> {
    const stockCache = storage?.getItem(storageKey);
    if (stockCache) {
      let parsed = JSON.parse(stockCache);
      return new Map(parsed);
    }
    return new Map();
  }

  const clearResult = (e?: React.BaseSyntheticEvent) => {
    e?.preventDefault();
    const parentResult: HTMLElement | null = document.getElementById("result");
    while (parentResult?.firstChild) {
      parentResult?.firstChild?.remove();
    }
  };

  const removeInput = (e?: React.BaseSyntheticEvent) => {
    e?.preventDefault();
    clearResult(e);
    stockCacheValueByName.delete(stockName);
    storage?.setItem(storageKey, JSON.stringify([...stockCacheValueByName]));
    setStockCacheValueByName(stockCacheValueByName);
    setStockName("");
  };

  function constructStockData(e: React.BaseSyntheticEvent): StockData {
    return {
      stockName: e.target.stockName.value,
      currentUnitPrice: e.target.currentUnitPrice.value,
      unitType: UnitType.LOT,
      totalLot: parseInt(e.target.totalLot.value),
      monthlyInvestTarget: e.target.monthlyInvestTarget.value,
      sinceYear: parseInt(e.target.sinceYear.value),
      sinceMonth: e.target.sinceMonth.value,
    };
  }

  const calculate = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    clearResult();
    const stockData = constructStockData(e);
    const stock = new ValueAveragingStockCalculator(stockData);

    const divElement: HTMLDivElement = document.createElement("div");
    element?.current?.appendChild(divElement);
    const vcaResult = getValueAveragingFormResult(stock);
    const root = ReactDOM.createRoot(divElement);
    root.render(vcaResult);
    stockCacheValueByName.set(String(stockData.stockName), stockData);
    storage?.setItem(storageKey, JSON.stringify([...stockCacheValueByName]));
    setStockCacheValueByName(stockCacheValueByName);
  };

  return (
    <>
      <form id="survey-form" onSubmit={calculate}>
        <div className="rowTab">
          <div className="labels">
            <label id="name-label" htmlFor="stockName">
              Nama Emiten:
            </label>
          </div>
          <div className="rightTab">
            <StockNameValueInput
              onChange={(e) => setStockName(e.target.value.toUpperCase())}
              stockName={stockName}
              stockCacheValueByName={stockCacheValueByName}
            />
          </div>
        </div>
        <div className="rowTab">
          <div className="labels">
            <label id="email-label" htmlFor="sinceMonth">
              Mulai sejak:
            </label>
          </div>
          <div className="rightTab">
            <SinceMonthValueInput stockCacheValueByName={stockCacheValueByName} stockName={stockName} />
            <SinceYearValueInput stockCacheValueByName={stockCacheValueByName} stockName={stockName} />
          </div>
        </div>
        <div className="rowTab">
          <div className="labels">
            <label id="number-label" htmlFor="totalLot">
              Stock yang dimiliki saat ini:
            </label>
          </div>
          <div className="rightTab">
            <TotalLotValueInput stockCacheValueByName={stockCacheValueByName} stockName={stockName} /> Lot
          </div>
        </div>
        <div className="rowTab">
          <div className="labels">
            <label id="number-label" htmlFor="currentUnitPrice">
              Harga saat ini (dalam unit):
            </label>
          </div>
          <div className="rightTab">
            <UnitPriceValueInput stockCacheValueByName={stockCacheValueByName} stockName={stockName} />
          </div>
        </div>
        <div className="rowTab">
          <div className="labels">
            <label id="number-label" htmlFor="monthlyInvestTarget">
              Target investasi bulanan:
            </label>
          </div>
          <div className="rightTab">
            <InvestTargetValueInput stockCacheValueByName={stockCacheValueByName} stockName={stockName} />
          </div>
        </div>
        <div>
          <div style={{ textAlign: "center" }}>
            <button className="submit-vca" type="submit">
              Calculate
            </button>
            <button className="clear-vca" onClick={clearResult}>
              Clear
            </button>
            <button className="reset-vca" onClick={removeInput}>
              Delete
            </button>
          </div>
        </div>
      </form>
      <div id="result" ref={element} />
    </>
  );
}
