/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { Mock } from "bun:test";
import { useStaticQuery } from "gatsby";

export const useStaticQueryMock = useStaticQuery as unknown as Mock<(query: string) => unknown>;

export const siteMetadata = {
  title: "Ferry's Blog",
  description: "Personal blog of Ferry",
  author: "Ferry",
  realName: "Ferry Suhandri",
  siteUrl: "https://ferry.vercel.app",
  publishDate: "2020-03-01",
  updatedAt: "2024-06-01T00:00:00Z",
  tagline: "Software engineer from Solok",
  copyright: "© 2026 Ferry",
  repo: "7sferry/gatsbyan",
};

/**
 * Answers each useStaticQuery call by its query name, e.g. `query AllPosts { ... }` reads `AllPosts`.
 * Anonymous queries read the `anonymous` entry.
 */
export function mockStaticQueries(dataByQueryName: Record<string, unknown>) {
  useStaticQueryMock.mockImplementation((query: string) => {
    const queryName = /query\s+(\w+)/.exec(query)?.[1] ?? "anonymous";
    return dataByQueryName[queryName];
  });
}
