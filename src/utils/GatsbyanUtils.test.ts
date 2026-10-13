/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { describe, expect, test } from "bun:test";
import { getPlurals, kebabCase } from "./GatsbyanUtils.tsx";

describe("kebabCase", () => {
  test("lowercases and joins words with dashes", () => {
    expect(kebabCase("Design Pattern")).toBe("design-pattern");
    expect(kebabCase("Programming Principle")).toBe("programming-principle");
  });

  test("splits camel case words", () => {
    expect(kebabCase("JavaScript")).toBe("java-script");
  });

  test("transliterates symbols", () => {
    expect(kebabCase("C++ & Go")).toBe("c-and-go");
  });
});

describe("getPlurals", () => {
  test("returns empty suffix for zero or one", () => {
    expect(getPlurals(0)).toBe("");
    expect(getPlurals(1)).toBe("");
  });

  test("returns 's' for more than one", () => {
    expect(getPlurals(2)).toBe("s");
    expect(getPlurals(100)).toBe("s");
  });
});
