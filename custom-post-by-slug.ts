export const customPostContextByCode = new Map<string, CustomPostAttr>([
  [
    "vca",
    {
      title: "Value Averaging Calculator",
      description: "Monthly Value Averaging Calculator. Kalkulator untuk menghitung Value Averaging secara bulanan",
      slug: "/blog/value-averaging-calculator",
      publishDate: new Date("2022-10-23"),
      lang: "id",
    },
  ],
]);

export interface CustomPostAttr {
  title: string;
  description: string;
  slug: string;
  publishDate: Date;
  lang: string;
  image?: string | null;
}
