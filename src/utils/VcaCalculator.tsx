/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2022      *
 ************************/
import { getNumberValueFromRupiah } from "./GatsbyanUtils";

export class VcaCalculator {
  readonly stockName: string;
  readonly sinceDate: Date;
  currentLotPrice: number;
  totalLot: number;
  monthlyInvestTarget: number;

  constructor(stockData: StockData) {
    this.stockName = String(stockData.stockName);
    this.currentLotPrice = getNumberValueFromRupiah(String(stockData.currentUnitPrice)) * 100;
    this.totalLot = getNumberValueFromRupiah(
      String(stockData.unitType === "lot" ? stockData.totalLot : stockData.totalLot ?? 0 / 100)
    );
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
}

export class StockData {
  readonly stockName?: string;
  readonly currentUnitPrice?: number;
  readonly totalLot?: number;
  readonly monthlyInvestTarget?: number;
  readonly sinceYear?: string;
  readonly sinceMonth?: string;
  readonly unitType?: string;
}
