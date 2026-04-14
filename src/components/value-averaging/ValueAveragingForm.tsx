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
import { AveragePriceValueInput } from "./AveragePriceValueInput.tsx";
import { ValueAveragingStockCalculator } from "../../utils/ValueAveragingStockCalculator.tsx";
import { getValueAveragingFormResult } from "./ValueAveragingFormResult.tsx";
import "./ValueAveraging.css";

const STORAGE_KEY = "vcaList";

function getStockCacheFromStorage(): Map<string, StockData> {
  if (typeof window === "undefined") return new Map();
  const stockCache = window.localStorage.getItem(STORAGE_KEY);
  if (stockCache) {
    return new Map(JSON.parse(stockCache));
  }
  return new Map();
}

function saveToStorage(cache: Map<string, StockData>) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...cache]));
  }
}

export function ValueAveragingForm() {
  const [stockCacheValueByName, setStockCacheValueByName] = React.useState(getStockCacheFromStorage);
  const [stockName, setStockName] = React.useState("");
  const [resultElement, setResultElement] = React.useState<React.ReactNode>(null);

  const clearResult = (e?: React.BaseSyntheticEvent) => {
    e?.preventDefault();
    setResultElement(null);
  };

  const removeInput = (e?: React.BaseSyntheticEvent) => {
    e?.preventDefault();
    setResultElement(null);
    const newCache = new Map(stockCacheValueByName);
    newCache.delete(stockName);
    saveToStorage(newCache);
    setStockCacheValueByName(newCache);
    setStockName("");
  };

  const calculate = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    const stockData: StockData = {
      stockName: e.target.stockName.value,
      currentUnitPrice: e.target.currentUnitPrice.value,
      averagePrice: e.target.averagePrice.value,
      unitType: UnitType.LOT,
      totalLot: parseInt(e.target.totalLot.value),
      monthlyInvestTarget: e.target.monthlyInvestTarget.value,
      sinceYear: parseInt(e.target.sinceYear.value),
      sinceMonth: e.target.sinceMonth.value,
    };
    const stock = new ValueAveragingStockCalculator(stockData);
    setResultElement(getValueAveragingFormResult(stock));

    const newCache = new Map(stockCacheValueByName);
    newCache.set(String(stockData.stockName), stockData);
    saveToStorage(newCache);
    setStockCacheValueByName(newCache);
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
            <label htmlFor="currentUnitPrice">Harga saat ini (per unit)</label>
            <UnitPriceValueInput stockCacheValueByName={stockCacheValueByName} stockName={stockName} />
          </div>
          <div className="vca-field">
            <label htmlFor="averagePrice">Harga rata-rata (per unit)</label>
            <AveragePriceValueInput stockCacheValueByName={stockCacheValueByName} stockName={stockName} />
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
        {resultElement && <div className="vca-result">{resultElement}</div>}
      </div>
    </div>
  );
}
