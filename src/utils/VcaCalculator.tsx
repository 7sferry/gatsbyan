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
    this.stockName = stockData.stockName;
    this.currentLotPrice = getNumberValueFromRupiah(stockData.currentUnitPrice.toString()) * 100;
    this.totalLot = getNumberValueFromRupiah(stockData.totalLot.toString());
    this.monthlyInvestTarget = getNumberValueFromRupiah(stockData.monthlyInvestTarget.toString());
    this.sinceDate = stockData.since;
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

type StockData = {
  readonly stockName: string;
  readonly currentUnitPrice: number;
  readonly totalLot: number;
  readonly monthlyInvestTarget: number;
  readonly since: Date;
};
