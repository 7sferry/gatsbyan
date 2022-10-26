/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2022      *
 ************************/
import { getNumberValueFromRupiah } from "./GatsbyanUtils";

export const VcaCalculator = /** @class */ (function () {
  function VcaCalculator(stockData) {
    this.stockName = stockData.stockName;
    this.currentLotPrice = Number(getNumberValueFromRupiah(stockData.currentUnitPrice)) * 100;
    this.totalLot = Number(getNumberValueFromRupiah(stockData.totalLot));
    this.monthlyInvestTarget = Number(getNumberValueFromRupiah(stockData.monthlyInvestTarget));
    this.sinceDate = stockData.since;
  }

  VcaCalculator.prototype.buyLot = function (lot) {
    this.totalLot += lot;
    return this.totalLot;
  };
  VcaCalculator.prototype.updateUnitPrice = function (newUnitPrice) {
    this.currentLotPrice = newUnitPrice * 100;
    return this.currentLotPrice;
  };
  VcaCalculator.prototype.totalPrice = function (lotShouldInvest = 0) {
    return this.currentLotPrice * (Number(lotShouldInvest) + this.totalLot);
  };
  VcaCalculator.prototype.countLotShouldInvest = function (budget, monthTotal) {
    return Math.round((budget * monthTotal - this.totalPrice()) / this.currentLotPrice);
  };
  return VcaCalculator;
})();
