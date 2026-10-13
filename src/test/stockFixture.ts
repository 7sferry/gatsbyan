/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { StockData, UnitType } from "../types/DataTypes.ts";
import { ValueAveragingStockCalculator } from "../utils/ValueAveragingStockCalculator.tsx";

// Form inputs arrive as rupiah strings, so overrides accept any value
export const createStock = (overrides: Partial<Record<keyof StockData, unknown>> = {}) =>
  new ValueAveragingStockCalculator({
    stockName: "BBCA",
    currentUnitPrice: 1000,
    averagePrice: 900,
    totalLot: 10,
    monthlyInvestTarget: 1_000_000,
    sinceYear: 2024,
    sinceMonth: "01",
    unitType: UnitType.LOT,
    ...overrides,
  } as StockData);
