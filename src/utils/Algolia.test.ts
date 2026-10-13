/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { describe, expect, test } from "bun:test";
import crypto from "crypto";
import { AlgoliaData, FlattenAlgoliaNode } from "../types/DataTypes.ts";
import { MAX_CONTENT_LENGTH, queries } from "./Algolia.tsx";

const createPost = (excerpt: string, id = "post-1") => ({
  id,
  title: `Title ${id}`,
  slug: `slug-${id}`,
  body: { childMarkdownRemark: { excerpt, internal: { contentDigest: "original-digest" } } },
});

const transform = (...posts: ReturnType<typeof createPost>[]): FlattenAlgoliaNode[] =>
  queries[0].transformer({ data: { allContentfulBlogPost: { nodes: posts } } } as AlgoliaData);

const excerpts = (records: FlattenAlgoliaNode[]) => records.map((record) => record.excerpt);

// "w000 w001 w002 ..." so every split point is a space
const words = (length: number) =>
  Array.from({ length: Math.ceil(length / 5) + 1 }, (_, i) => "w" + String(i % 1000).padStart(3, "0"))
    .join(" ")
    .substring(0, length);

describe("Algolia queries", () => {
  test("indexes blog posts distinct by slug", () => {
    expect(queries).toHaveLength(1);
    expect(queries[0].query).toContain("allContentfulBlogPost");
    expect(queries[0].settings).toEqual({ attributeForDistinct: "slug", distinct: true });
  });

  test("flattens a short post into one record", () => {
    const records = transform(createPost("short body"));
    const contentDigest = crypto
      .createHash("md5")
      .update(JSON.stringify({ content: "short body", slug: "slug-post-1", title: "Title post-1" }))
      .digest("hex");

    expect(records).toEqual([
      {
        id: "post-1_1",
        title: "Title post-1",
        slug: "slug-post-1",
        excerpt: "short body",
        internal: { contentDigest },
      },
    ]);
  });

  test("creates records for every post", () => {
    const records = transform(createPost("first", "a"), createPost("second", "b"));

    expect(records.map((record) => [record.id, record.excerpt])).toEqual([
      ["a_1", "first"],
      ["b_1", "second"],
    ]);
  });

  test("splits long posts at word boundaries with descending ids", () => {
    const excerpt = words(20_000);
    const records = transform(createPost(excerpt));

    expect(records.map((record) => record.id)).toEqual(["post-1_3", "post-1_2", "post-1_1"]);
    expect(excerpts(records).join("")).toBe(excerpt);
    excerpts(records).forEach((content) => {
      expect(content.length).toBeLessThanOrEqual(MAX_CONTENT_LENGTH);
    });
    excerpts(records)
      .slice(1)
      .forEach((content) => {
        expect(content.startsWith(" ")).toBe(true);
      });
  });

  test("gives each record its own content digest", () => {
    const records = transform(createPost(words(20_000)));

    expect(new Set(records.map((record) => record.internal.contentDigest)).size).toBe(3);
  });

  test("keeps the last words when the length is an exact multiple of the limit", () => {
    const excerpt = words(MAX_CONTENT_LENGTH * 2);

    expect(excerpt).toHaveLength(MAX_CONTENT_LENGTH * 2);
    expect(excerpts(transform(createPost(excerpt))).join("")).toBe(excerpt);
  });

  test("keeps records within the limit when a split leaves a long word behind", () => {
    const excerpt = "a " + "x".repeat(16_000) + " end";
    const records = transform(createPost(excerpt));

    expect(excerpts(records).join("")).toBe(excerpt);
    excerpts(records).forEach((content) => {
      expect(content.length).toBeLessThanOrEqual(MAX_CONTENT_LENGTH);
    });
  });

  test("cuts text without spaces at the limit", () => {
    const excerpt = "x".repeat(20_000);

    expect(excerpts(transform(createPost(excerpt))).map((content) => content.length)).toEqual([8500, 8500, 3000]);
  });

  test("splits at new lines too", () => {
    const line = "y".repeat(5000);
    const excerpt = `${line}\n${line}`;

    expect(excerpts(transform(createPost(excerpt)))).toEqual([line, `\n${line}`]);
  });

  test("keeps a post exactly at the limit in one record", () => {
    expect(transform(createPost("z".repeat(MAX_CONTENT_LENGTH)))).toHaveLength(1);
  });

  test("skips posts without content", () => {
    expect(transform(createPost(""))).toEqual([]);
  });
});
