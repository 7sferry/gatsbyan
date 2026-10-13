/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { describe, expect, mock, test } from "bun:test";
import React from "react";
import { render, screen } from "@testing-library/react";
import { setupUser } from "../../test/user.ts";
import { StockData } from "../../types/DataTypes.ts";
import { AveragePriceValueInput } from "./AveragePriceValueInput.tsx";
import { InvestTargetValueInput } from "./InvestTargetValueInput.tsx";
import { SinceMonthValueInput } from "./SinceMonthValueInput.tsx";
import { SinceYearValueInput } from "./SinceYearValueInput.tsx";
import { StockNameValueInput } from "./StockNameValueInput.tsx";
import { TotalLotValueInput } from "./TotalLotValueInput.tsx";
import { UnitPriceValueInput } from "./UnitPriceValueInput.tsx";
import { UnitTypeValueInput } from "./UnitTypeValueInput.tsx";

const cache = new Map([
  [
    "BBCA",
    {
      stockName: "BBCA",
      currentUnitPrice: "Rp9.500",
      averagePrice: "Rp9.000",
      totalLot: 0,
      monthlyInvestTarget: "Rp1.000.000",
      sinceYear: 2023,
      sinceMonth: "03",
    } as unknown as StockData,
  ],
]);

const field = (name: string) => document.querySelector<HTMLInputElement>(`[name="${name}"]`)!;

describe.each([
  ["averagePrice", AveragePriceValueInput, "Rp9.000"],
  ["currentUnitPrice", UnitPriceValueInput, "Rp9.500"],
  ["monthlyInvestTarget", InvestTargetValueInput, "Rp1.000.000"],
])("%s rupiah input", (name, Input, cachedValue) => {
  test("fills the saved value of the stock", () => {
    render(<Input stockCacheValueByName={cache} stockName="BBCA" />);

    expect(field(name).value).toBe(cachedValue);
  });

  test("starts empty for a new stock", () => {
    render(<Input stockCacheValueByName={cache} stockName="TLKM" />);

    expect(field(name).value).toBe("");
  });

  test("formats typed numbers as rupiah", async () => {
    const user = setupUser();
    render(<Input stockCacheValueByName={cache} stockName="TLKM" />);

    await user.type(field(name), "1250000");

    expect(field(name).value).toBe("Rp1.250.000");
  });
});

describe("SinceMonthValueInput", () => {
  test("selects the saved month and lists every month", async () => {
    const user = setupUser();
    render(<SinceMonthValueInput stockCacheValueByName={cache} stockName="BBCA" />);

    expect(field("sinceMonth").value).toBe("03");
    expect(screen.getAllByRole("option")).toHaveLength(13);

    await user.selectOptions(field("sinceMonth"), "Desember");
    expect(field("sinceMonth").value).toBe("12");
  });
});

describe("SinceYearValueInput", () => {
  test("fills the saved year and accepts a new one", async () => {
    const user = setupUser();
    render(<SinceYearValueInput stockCacheValueByName={cache} stockName="BBCA" />);
    expect(field("sinceYear").value).toBe("2023");

    await user.clear(field("sinceYear"));
    await user.type(field("sinceYear"), "2024");

    expect(field("sinceYear").value).toBe("2024");
  });
});

describe("TotalLotValueInput", () => {
  test("keeps a saved zero lot", () => {
    render(<TotalLotValueInput stockCacheValueByName={cache} stockName="BBCA" />);

    expect(field("totalLot").value).toBe("0");
  });

  test("starts empty for a new stock", () => {
    render(<TotalLotValueInput stockCacheValueByName={cache} stockName="TLKM" />);

    expect(field("totalLot").value).toBe("");
  });
});

describe("StockNameValueInput", () => {
  test("suggests saved stocks and reports typing", async () => {
    const user = setupUser();
    const onChange = mock();
    render(<StockNameValueInput stockName="" stockCacheValueByName={cache} onChange={onChange} />);

    expect(
      Array.from(document.querySelectorAll("#stockNames option"), (option) => option.getAttribute("value"))
    ).toEqual(["BBCA"]);

    await user.type(field("stockName"), "b");
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});

describe("UnitTypeValueInput", () => {
  test("only offers lot", () => {
    render(<UnitTypeValueInput />);

    expect(screen.getAllByRole("option").map((option) => option.textContent)).toEqual(["Lot"]);
    expect(field("unitType").value).toBe("0");
  });
});
