/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { afterEach, beforeEach, describe, expect, setSystemTime, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { getValueAveragingFormResult } from "./ValueAveragingFormResult.tsx";
import { createStock } from "../../test/stockFixture.ts";
import { getParagraphs } from "../../test/renderUtils.ts";

// Default fixture starts on January 2024, so March 2024 is the third month
const renderResult = (...args: Parameters<typeof createStock>) =>
  getParagraphs(renderToStaticMarkup(getValueAveragingFormResult(createStock(...args))));

describe("getValueAveragingFormResult", () => {
  beforeEach(() => {
    setSystemTime(new Date("2024-03-15T00:00:00Z"));
  });

  afterEach(() => {
    setSystemTime();
  });

  test("rejects a start month in the future", () => {
    expect(renderResult({ sinceMonth: "05" })).toEqual(["bulan mulai tidak boleh dari masa depan"]);
  });

  test("rejects a zero current price", () => {
    expect(renderResult({ currentUnitPrice: "Rp0" })).toEqual(["harga saat ini harus lebih dari Rp0"]);
  });

  test("rejects a budget below one lot when no lot is owned yet", () => {
    expect(renderResult({ totalLot: 0, monthlyInvestTarget: 50_000 })).toEqual([
      "Uangnya tidak cukup untuk membeli stock ini. Minimal Rp100.000 untuk pembelian satu lot",
    ]);
  });

  test("advises buying lots to reach the monthly target", () => {
    const result = renderResult();

    expect(result).toContain("sekarang bulan ke-3");
    expect(result).toContain("maka bulan ini saya harus investasi sebanyak: 20 lot (2000 unit) senilai Rp2.000.000");
    expect(result).toContain("lalu jumlah stock yang akan saya miliki menjadi 30 lot (3.000 unit)");
    expect(result).toContain("kemudian total investasi saya akan menjadi Rp3.000.000");
    expect(result).toContain("dan harga rata-rata baru menjadi Rp966,67/unit");
  });

  test("skips selling when the average price is above the current price", () => {
    const result = renderResult({ totalLot: 100, averagePrice: 1200, monthlyInvestTarget: 100_000 });

    expect(result).toContain(
      "maka bulan ini tidak perlu investasi karena harga rata-rata lebih tinggi dari harga saat ini"
    );
    expect(result).toContain("lalu jumlah stock yang akan saya miliki menjadi 100 lot (10.000 unit)");
  });

  test("advises taking profit when holdings exceed the target", () => {
    const result = renderResult({ totalLot: 100, averagePrice: 500, monthlyInvestTarget: 100_000 });

    expect(result).toContain("maka bulan ini saatnya taking profit dulu 97 lot (9700 unit) senilai Rp9.700.000🤑");
    expect(result).toContain("lalu jumlah stock yang akan saya miliki menjadi 3 lot (300 unit)");
  });
});
