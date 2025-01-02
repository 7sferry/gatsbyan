/************************
 * Made by [MR Ferry™]  *
 * on Januari 2025      *
 ************************/

import React from "react";

let thousandSeparator = ".";
let decimalSeparator = ",";
const locales = "id-ID";
const currencySymbol = "Rp";

export function getNumberValueFromRupiah(input: string) {
  input = input.replace(currencySymbol, "").replaceAll(thousandSeparator, "");
  const fixedNumber = input.replaceAll(decimalSeparator, thousandSeparator);
  let val = parseFloat(fixedNumber);
  return isNaN(val) ? 0 : val;
}

export const onChangeRupiah = (event: React.ChangeEvent<HTMLInputElement>) => {
  let input = event?.target?.value;
  if (!input || input === currencySymbol || input?.trim() === "") {
    return "";
  }
  if (input === currencySymbol + "0") {
    return input;
  }
  let result: number = getNumberValueFromRupiah(input);
  let decimal = "";
  const split = input.split(decimalSeparator);
  if (input.endsWith(decimalSeparator) && (split.length <= 2 || input.endsWith(decimalSeparator + decimalSeparator))) {
    decimal = decimalSeparator;
  }
  if (input === decimalSeparator || input.startsWith(currencySymbol + decimalSeparator)) {
    result = 0;
  }
  let lastZero = "";
  if (split.length >= 2) {
    const secondElement: string = split[1];
    let temp = "1" + secondElement;
    const parsedSecondElement = parseInt(temp);
    lastZero = parsedSecondElement.toString().slice(1);

    decimal = decimalSeparator;
    result = parseInt(result.toString());
  }
  return rp(Number(result)) + decimal + lastZero;
};

export function getMonthDifference(startDate: Date, endDate: Date) {
  return endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear());
}

export function rp(val: number) {
  return currencySymbol + (val?.toLocaleString(locales, { maximumFractionDigits: 2 }) ?? 0);
}
