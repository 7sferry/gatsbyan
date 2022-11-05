import { getMonthDifference, rp } from "../utils/GatsbyanUtils";
import React from "react";
import { VcaCalculator } from "../utils/VcaCalculator";
import { format } from 'date-fns'
/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2022      *
 ************************/

export const getVcaResult = (stock: VcaCalculator) => {
  const monthDifference = getMonthDifference(stock.sinceDate, new Date());
  const lotShouldInvest = stock?.countLotShouldInvest(stock.monthlyInvestTarget, monthDifference + 1);
  if (stock?.totalLot <= 0 && stock.monthlyInvestTarget < stock?.currentLotPrice) {
    return (
      <p>{`Uangnya tidak cukup untuk membeli stock ini. Minimal ${rp(
        stock?.currentLotPrice
      )} untuk pembelian satu lot`}</p>
    );
  }

  return (
    <>
      <p>{`saya berniat untuk investasi senilai ${rp(stock.monthlyInvestTarget)} perbulan pada saham ${
        stock?.stockName
      }`}</p>
      <p>{`harga saat ini adalah ${rp(stock?.currentLotPrice)} untuk satu lot`}</p>
      <p>{`jumlah stock yang saya miliki sejak ${format(stock.sinceDate, "MMMM YYYY")} adalah ${(
        stock?.totalLot * 100
      ).toLocaleString("id-ID")} Unit
        (${stock?.totalLot.toLocaleString("id-ID")} Lot)`}</p>
      <p>{`total investasi yang saya miliki sejak ${format(stock.sinceDate, "MMMM YYYY")} adalah ${rp(
        stock?.totalPrice()
      )}`}</p>
      <p>{`sekarang bulan ke-${monthDifference + 1}`}</p>
      <p>
        {lotShouldInvest >= 0
          ? `maka bulan ini saya harus investasi sebanyak: ${lotShouldInvest} lot senilai ${rp(
              lotShouldInvest * stock?.currentLotPrice
            )}`
          : `maka bulan ini saatnya taking profit dulu ${Math.abs(lotShouldInvest)} lot senilai ${rp(
              Math.abs(lotShouldInvest * stock?.currentLotPrice)
            )}🤑`}
      </p>
      <p>{`lalu jumlah stock yang akan saya miliki menjadi ${((stock?.totalLot + lotShouldInvest) * 100).toLocaleString(
        "id-ID"
      )} Unit
        (${(stock?.totalLot + lotShouldInvest).toLocaleString("id-ID")} Lot)`}</p>
      <p>{`kemudian total investasi saya akan menjadi ${rp(stock?.totalPrice(lotShouldInvest))}`}</p>
    </>
  );
};
