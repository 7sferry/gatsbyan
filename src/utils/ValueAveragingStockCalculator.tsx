/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2022      *
 ************************/
import { getNumberValueFromRupiah } from "./GatsbyanUtils";
import { StockData, UnitType } from "../types/DataTypes";

export class ValueAveragingStockCalculator {
  readonly stockName: string;
  readonly sinceDate: Date;
  currentLotPrice: number;
  totalLot: number;
  monthlyInvestTarget: number;

  constructor(stockData: StockData) {
    this.stockName = String(stockData.stockName);
    this.currentLotPrice = getNumberValueFromRupiah(String(stockData.currentUnitPrice)) * 100;
    this.totalLot = this.getTotalLot(stockData);
    this.monthlyInvestTarget = getNumberValueFromRupiah(String(stockData.monthlyInvestTarget));
    this.sinceDate = new Date(stockData.sinceYear + "-" + stockData.sinceMonth);
  }

  buyLot(lot: number) {
    this.totalLot += lot;
    return this.totalLot;
  }

  updateUnitPrice(newUnitPrice: number) {
    this.currentLotPrice = newUnitPrice * 100;
    return this.currentLotPrice;
  }

  totalPrice(lotShouldInvest = 0) {
    return this.currentLotPrice * (Number(lotShouldInvest) + this.totalLot);
  }

  countLotShouldInvest(budget: number, monthTotal: number) {
    return Math.round((budget * monthTotal - this.totalPrice()) / this.currentLotPrice);
  }

  private getTotalLot(stockData: StockData) {
    return String(stockData.unitType) === UnitType.LOT.toString() ? stockData.totalLot : stockData.totalLot / 100;
  }
}
