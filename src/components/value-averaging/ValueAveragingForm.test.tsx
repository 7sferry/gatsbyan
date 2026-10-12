/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { afterEach, beforeEach, describe, expect, setSystemTime, test } from "bun:test";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ValueAveragingForm } from "./ValueAveragingForm.tsx";

const STORAGE_KEY = "vcaList";

const field = (name: string) => document.querySelector<HTMLInputElement>(`[name="${name}"]`)!;

const savedStocks = () => new Map(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"));

const result = () => document.querySelector(".vca-result");

async function fillForm() {
  await userEvent.type(field("stockName"), "bbca");
  await userEvent.selectOptions(field("sinceMonth"), "Januari");
  await userEvent.type(field("sinceYear"), "2024");
  await userEvent.type(field("totalLot"), "10");
  await userEvent.type(field("currentUnitPrice"), "1000");
  await userEvent.type(field("averagePrice"), "900");
  await userEvent.type(field("monthlyInvestTarget"), "1000000");
}

describe("ValueAveragingForm", () => {
  beforeEach(() => {
    localStorage.clear();
    setSystemTime(new Date("2024-03-15T00:00:00Z"));
  });

  afterEach(() => {
    setSystemTime();
  });

  test("uppercases the stock name and formats prices", async () => {
    render(<ValueAveragingForm />);

    await fillForm();

    expect(field("stockName").value).toBe("BBCA");
    expect(field("currentUnitPrice").value).toBe("Rp1.000");
    expect(field("monthlyInvestTarget").value).toBe("Rp1.000.000");
  });

  test("calculates how many lots to buy this month", async () => {
    render(<ValueAveragingForm />);
    await fillForm();

    await userEvent.click(screen.getByRole("button", { name: "Calculate" }));

    expect(result()!.textContent).toContain("sekarang bulan ke-3");
    expect(result()!.textContent).toContain("maka bulan ini saya harus investasi sebanyak: 20 lot");
  });

  test("saves the stock for next time", async () => {
    render(<ValueAveragingForm />);
    await fillForm();

    await userEvent.click(screen.getByRole("button", { name: "Calculate" }));

    expect(savedStocks().get("BBCA")).toEqual({
      stockName: "BBCA",
      currentUnitPrice: "Rp1.000",
      averagePrice: "Rp900",
      unitType: 0,
      totalLot: 10,
      monthlyInvestTarget: "Rp1.000.000",
      sinceYear: 2024,
      sinceMonth: "01",
    });
  });

  test("fills a saved stock when its name is typed", async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        [
          "TLKM",
          {
            stockName: "TLKM",
            currentUnitPrice: "Rp3.000",
            averagePrice: "Rp3.500",
            totalLot: 5,
            monthlyInvestTarget: "Rp500.000",
            sinceYear: 2023,
            sinceMonth: "06",
          },
        ],
      ])
    );
    render(<ValueAveragingForm />);

    expect(document.querySelector("#stockNames option")!.getAttribute("value")).toBe("TLKM");
    await userEvent.type(field("stockName"), "tlkm");

    expect(
      ["sinceMonth", "sinceYear", "totalLot", "currentUnitPrice", "averagePrice", "monthlyInvestTarget"].map(
        (name) => field(name).value
      )
    ).toEqual(["06", "2023", "5", "Rp3.000", "Rp3.500", "Rp500.000"]);
  });

  test("clears the result but keeps the input", async () => {
    render(<ValueAveragingForm />);
    await fillForm();
    await userEvent.click(screen.getByRole("button", { name: "Calculate" }));

    await userEvent.click(screen.getByRole("button", { name: "Clear" }));

    expect(result()).toBeNull();
    expect(field("stockName").value).toBe("BBCA");
  });

  test("deletes the saved stock", async () => {
    render(<ValueAveragingForm />);
    await fillForm();
    await userEvent.click(screen.getByRole("button", { name: "Calculate" }));

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(result()).toBeNull();
    expect(field("stockName").value).toBe("");
    expect(savedStocks().has("BBCA")).toBe(false);
    await waitFor(() => expect(document.querySelectorAll("#stockNames option")).toHaveLength(0));
  });
});
