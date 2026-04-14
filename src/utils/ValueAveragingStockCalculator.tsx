/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2022      *
 ************************/
import { StockData, UnitType } from "../types/DataTypes";
import { getNumberValueFromRupiah } from "./VcaUtils";

export class ValueAveragingStockCalculator {
  readonly stockName: string;
  readonly sinceDate: Date;
  currentLotPrice: number;
  averageLotPrice: number;
  totalLot: number;
  monthlyInvestTarget: number;

  constructor(stockData: StockData) {
    this.stockName = String(stockData.stockName);
    this.currentLotPrice = getNumberValueFromRupiah(String(stockData.currentUnitPrice)) * 100;
    this.averageLotPrice = getNumberValueFromRupiah(String(stockData.averagePrice)) * 100;
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

  totalCost() {
    return this.averageLotPrice * this.totalLot;
  }

  newAverageLotPrice(lotShouldInvest: number) {
    const newTotalLot = this.totalLot + lotShouldInvest;
    if (newTotalLot <= 0) return 0;
    return (this.totalCost() + lotShouldInvest * this.currentLotPrice) / newTotalLot;
  }

  countLotShouldInvest(budget: number, monthTotal: number) {
    return Math.round((budget * monthTotal - this.totalPrice()) / this.currentLotPrice);
  }

  private getTotalLot(stockData: StockData) {
    return String(stockData.unitType) === UnitType.LOT.toString() ? stockData.totalLot : stockData.totalLot / 100;
  }
}
