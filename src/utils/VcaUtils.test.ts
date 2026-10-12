/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { describe, expect, test } from "bun:test";
import React from "react";
import { getMonthDifference, getNumberValueFromRupiah, onChangeRupiah, rp } from "./VcaUtils.tsx";

const changeEvent = (value: string) => ({ target: { value } }) as React.ChangeEvent<HTMLInputElement>;

describe("getNumberValueFromRupiah", () => {
  test("parses formatted rupiah", () => {
    expect(getNumberValueFromRupiah("Rp1.234.567")).toBe(1234567);
    expect(getNumberValueFromRupiah("Rp1.234,5")).toBe(1234.5);
    expect(getNumberValueFromRupiah("2500")).toBe(2500);
  });

  test("returns 0 for invalid input", () => {
    expect(getNumberValueFromRupiah("")).toBe(0);
    expect(getNumberValueFromRupiah("Rp")).toBe(0);
    expect(getNumberValueFromRupiah("abc")).toBe(0);
  });
});

describe("rp", () => {
  test("formats with Indonesian separators", () => {
    expect(rp(1234567)).toBe("Rp1.234.567");
    expect(rp(0)).toBe("Rp0");
  });

  test("rounds to two decimals", () => {
    expect(rp(1234.567)).toBe("Rp1.234,57");
  });
});

describe("onChangeRupiah", () => {
  test("clears empty input", () => {
    expect(onChangeRupiah(changeEvent(""))).toBe("");
    expect(onChangeRupiah(changeEvent("Rp"))).toBe("");
    expect(onChangeRupiah(changeEvent("   "))).toBe("");
  });

  test("keeps a single zero", () => {
    expect(onChangeRupiah(changeEvent("Rp0"))).toBe("Rp0");
  });

  test("adds currency symbol and thousand separators", () => {
    expect(onChangeRupiah(changeEvent("5"))).toBe("Rp5");
    expect(onChangeRupiah(changeEvent("Rp1000"))).toBe("Rp1.000");
    expect(onChangeRupiah(changeEvent("Rp1.0000"))).toBe("Rp10.000");
  });

  test("keeps a trailing decimal separator while typing", () => {
    expect(onChangeRupiah(changeEvent("Rp1.000,"))).toBe("Rp1.000,");
    expect(onChangeRupiah(changeEvent(","))).toBe("Rp0,");
  });

  test("keeps decimal digits including leading zeros", () => {
    expect(onChangeRupiah(changeEvent("Rp1.000,50"))).toBe("Rp1.000,50");
    expect(onChangeRupiah(changeEvent("Rp1.000,05"))).toBe("Rp1.000,05");
  });
});

describe("getMonthDifference", () => {
  test("counts months across years", () => {
    expect(getMonthDifference(new Date(2024, 0, 31), new Date(2025, 2, 1))).toBe(14);
  });

  test("returns 0 for the same month and negative for past end dates", () => {
    expect(getMonthDifference(new Date(2024, 5, 1), new Date(2024, 5, 30))).toBe(0);
    expect(getMonthDifference(new Date(2024, 5, 1), new Date(2024, 3, 1))).toBe(-2);
  });
});
