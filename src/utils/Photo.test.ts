/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { afterEach, describe, expect, test } from "bun:test";
import getPhotoBio from "./Photo.tsx";
import { mockStaticQueries, useStaticQueryMock } from "../test/staticQuery.ts";
import { createImages, expectedArtDirection } from "../test/fixtures.ts";

describe("getPhotoBio", () => {
  afterEach(() => {
    useStaticQueryMock.mockReset();
  });

  test("art directs the bio photo for phone, ipad and laptop", () => {
    mockStaticQueries({ PhotoBio: { file: { childImageSharp: createImages("ferry") } } });

    expect(getPhotoBio()).toEqual(expectedArtDirection("ferry") as never);
  });
});
