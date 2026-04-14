import React from "react";
import { ValueAveragingStockCalculator } from "../../utils/ValueAveragingStockCalculator.tsx";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { getMonthDifference, rp } from "../../utils/VcaUtils.tsx";

/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2022      *
 ************************/

export const getValueAveragingFormResult = (stock: ValueAveragingStockCalculator) => {
  const monthDifference = getMonthDifference(stock.sinceDate, new Date());
  if (monthDifference < 0) {
    return <p>bulan mulai tidak boleh dari masa depan</p>;
  }
  const rawLotShouldInvest = stock.countLotShouldInvest(stock.monthlyInvestTarget, monthDifference + 1);
  const skipTakeProfit = rawLotShouldInvest < 0 && stock.averageLotPrice > stock.currentLotPrice;
  const lotShouldInvest = skipTakeProfit ? 0 : rawLotShouldInvest;
  if (stock.totalLot <= 0 && stock.monthlyInvestTarget < stock.currentLotPrice) {
    return (
      <p>{`Uangnya tidak cukup untuk membeli stock ini. Minimal ${rp(
        stock.currentLotPrice
      )} untuk pembelian satu lot`}</p>
    );
  }

  const formattedSinceDate = format(stock.sinceDate, "MMMM yyyy", { locale: id });
  return (
    <>
      <p>{`saya berniat untuk investasi senilai ${rp(stock.monthlyInvestTarget)} perbulan pada saham ${
        stock.stockName
      }`}</p>
      <p>{`harga saat ini adalah ${rp(stock.currentLotPrice / 100)}/unit atau ${rp(stock.currentLotPrice)} untuk pembelian satu lot`}</p>
      <p>{`jumlah stock yang saya miliki sejak ${formattedSinceDate} adalah
      ${stock.totalLot.toLocaleString("id-ID")} lot (${(stock.totalLot * 100).toLocaleString("id-ID")} unit)`}</p>
      <p>{`harga rata-rata saat ini adalah ${rp(stock.averageLotPrice / 100)}/unit`}</p>
      <p>{`total modal yang saya miliki sejak ${formattedSinceDate} adalah
       ${rp(stock.totalCost())}`}</p>
      <p>{`sekarang bulan ke-${monthDifference + 1}`}</p>
      <p>{calculateInvestmentAdvice(skipTakeProfit, lotShouldInvest, stock)}</p>
      <p>{`lalu jumlah stock yang akan saya miliki menjadi ${(stock.totalLot + lotShouldInvest).toLocaleString(
        "id-ID"
      )} lot
        (${((stock.totalLot + lotShouldInvest) * 100).toLocaleString("id-ID")} unit)`}</p>
      <p>{`kemudian total investasi saya akan menjadi ${rp(stock.totalPrice(lotShouldInvest))}`}</p>
      <p>{`dan harga rata-rata baru menjadi ${rp(stock.newAverageLotPrice(lotShouldInvest) / 100)}/unit`}</p>
    </>
  );
};

function calculateInvestmentAdvice(
  skipTakeProfit: boolean,
  lotShouldInvest: number,
  stock: ValueAveragingStockCalculator
) {
  if (skipTakeProfit) {
    return `maka bulan ini tidak perlu investasi karena harga rata-rata lebih tinggi dari harga saat ini`;
  }
  if (lotShouldInvest >= 0) {
    return `maka bulan ini saya harus investasi sebanyak: ${lotShouldInvest} lot (${
      lotShouldInvest * 100
    } unit) senilai ${rp(lotShouldInvest * stock.currentLotPrice)}`;
  }
  return `maka bulan ini saatnya taking profit dulu ${Math.abs(lotShouldInvest)} lot (${
    Math.abs(lotShouldInvest) * 100
  } unit) senilai ${rp(Math.abs(lotShouldInvest * stock.currentLotPrice))}🤑`;
}
