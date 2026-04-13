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
import "./ValueAveraging.css";

export function ValueAveragingForm() {
  const storageKey = "vcaList";
  const storage = typeof window !== "undefined" ? window.localStorage : null;
  const [stockCacheValueByName, setStockCacheValueByName] = React.useState(getStockCacheValue());
  const [stockName, setStockName] = React.useState("");
  const element: React.RefObject<HTMLDivElement | null> = React.createRef();

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
    divElement.className = "vca-result";
    element?.current?.appendChild(divElement);
    const vcaResult = getValueAveragingFormResult(stock);
    const root = ReactDOM.createRoot(divElement);
    root.render(vcaResult);
    stockCacheValueByName.set(String(stockData.stockName), stockData);
    storage?.setItem(storageKey, JSON.stringify([...stockCacheValueByName]));
    setStockCacheValueByName(stockCacheValueByName);
  };

  return (
    <div className="vca-wrapper">
      <div className="vca-card">
        <form id="survey-form" onSubmit={calculate}>
          <div className="vca-field">
            <label htmlFor="stockName">Nama Emiten</label>
            <StockNameValueInput
              onChange={(e) => setStockName(e.target.value.toUpperCase())}
              stockName={stockName}
              stockCacheValueByName={stockCacheValueByName}
            />
          </div>
          <div className="vca-field">
            <label htmlFor="sinceMonth">Mulai sejak</label>
            <div className="vca-field-row">
              <SinceMonthValueInput stockCacheValueByName={stockCacheValueByName} stockName={stockName} />
              <SinceYearValueInput stockCacheValueByName={stockCacheValueByName} stockName={stockName} />
            </div>
          </div>
          <div className="vca-field">
            <label htmlFor="totalLot">Stock yang dimiliki saat ini</label>
            <TotalLotValueInput stockCacheValueByName={stockCacheValueByName} stockName={stockName} />
            <div className="vca-suffix">dalam satuan Lot</div>
          </div>
          <div className="vca-field">
            <label htmlFor="currentUnitPrice">Harga saat ini (dalam unit)</label>
            <UnitPriceValueInput stockCacheValueByName={stockCacheValueByName} stockName={stockName} />
          </div>
          <div className="vca-field">
            <label htmlFor="monthlyInvestTarget">Target investasi bulanan</label>
            <InvestTargetValueInput stockCacheValueByName={stockCacheValueByName} stockName={stockName} />
          </div>
          <div className="vca-buttons">
            <button className="vca-btn vca-btn-calculate" type="submit">
              Calculate
            </button>
            <button className="vca-btn vca-btn-clear" onClick={clearResult}>
              Clear
            </button>
            <button className="vca-btn vca-btn-delete" onClick={removeInput}>
              Delete
            </button>
          </div>
        </form>
        <div id="result" ref={element} />
      </div>
    </div>
  );
}
