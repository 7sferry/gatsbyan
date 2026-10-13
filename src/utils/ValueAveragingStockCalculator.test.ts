/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { describe, expect, test } from "bun:test";
import { UnitType } from "../types/DataTypes.ts";
import { createStock } from "../test/stockFixture.ts";

describe("ValueAveragingStockCalculator", () => {
  test("converts unit prices to lot prices", () => {
    const stock = createStock();
    expect(stock.stockName).toBe("BBCA");
    expect(stock.currentLotPrice).toBe(100_000);
    expect(stock.averageLotPrice).toBe(90_000);
    expect(stock.monthlyInvestTarget).toBe(1_000_000);
    expect(stock.sinceDate.toISOString()).toBe("2024-01-01T00:00:00.000Z");
  });

  test("parses rupiah formatted input", () => {
    const stock = createStock({
      currentUnitPrice: "Rp1.250",
      averagePrice: "Rp1.100,5",
      monthlyInvestTarget: "Rp2.000.000",
    });
    expect(stock.currentLotPrice).toBe(125_000);
    expect(stock.averageLotPrice).toBe(110_050);
    expect(stock.monthlyInvestTarget).toBe(2_000_000);
  });

  test("converts units to lots", () => {
    expect(createStock({ unitType: UnitType.LOT, totalLot: 10 }).totalLot).toBe(10);
    expect(createStock({ unitType: UnitType.UNIT, totalLot: 1500 }).totalLot).toBe(15);
  });

  test("buyLot and updateUnitPrice", () => {
    const stock = createStock();
    expect(stock.buyLot(5)).toBe(15);
    expect(stock.updateUnitPrice(1200)).toBe(120_000);
    expect(stock.totalPrice()).toBe(1_800_000);
  });

  test("totalPrice and totalCost", () => {
    const stock = createStock();
    expect(stock.totalPrice()).toBe(1_000_000);
    expect(stock.totalPrice(5)).toBe(1_500_000);
    expect(stock.totalCost()).toBe(900_000);
  });

  test("newAverageLotPrice", () => {
    const stock = createStock();
    expect(stock.newAverageLotPrice(10)).toBe(95_000);
    expect(stock.newAverageLotPrice(0)).toBe(90_000);
    expect(stock.newAverageLotPrice(-10)).toBe(0);
  });

  test("countLotShouldInvest", () => {
    const stock = createStock();
    expect(stock.countLotShouldInvest(1_000_000, 3)).toBe(20);
    expect(stock.countLotShouldInvest(100_000, 5)).toBe(-5);
  });
});
