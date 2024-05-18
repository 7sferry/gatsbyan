import { IGatsbyImageData } from "gatsby-plugin-image";
import React from "react";

export enum UnitType {
  LOT,
  UNIT,
}

export class StockData {
  readonly stockName?: string;
  readonly currentUnitPrice?: number;
  readonly totalLot: number = 0;
  readonly monthlyInvestTarget?: number;
  readonly sinceYear?: number;
  readonly sinceMonth?: string;
  readonly unitType?: UnitType;
}

export interface StockCacheInputProps {
  readonly stockCacheValue: StockData;
}

export interface AllContentfulBlogPost {
  readonly allContentfulBlogPost: {
    readonly nodes: Array<{
      readonly tags: Array<string>;
      readonly slug: string;
    }>;
  };
}

export interface CustomSiteAttr {
  readonly url: string;
  readonly repo: string;
}

export interface BioAttr {
  readonly author: string;
  readonly tagline: string;
  readonly photo: IGatsbyImageData;
}

export interface LeftSidebarAttr {
  readonly photo: {};
  readonly author: string;
  readonly tagline: string;
  readonly contacts: {};
}

export interface ContactsAttr {
  readonly linkedin: string;
  readonly github: string;
  readonly facebook: string;
  readonly stackOverFlow: string;
  readonly resume: string;
  readonly crystal: string;
}

export interface MobileBioAttr {
  readonly author: string;
  readonly tagline: string;
  readonly photo: IGatsbyImageData;
}

export interface CustomPostAttr {
  readonly title: string;
  readonly description: string;
  readonly publishDate: Date;
  readonly lang: string;
  readonly image?: string | null;
}

export interface SeoAttr {
  readonly description?: string;
  readonly lang?: string;
  readonly title?: string;
  readonly image?: string;
  readonly path?: string;
}

export interface CommaSeparatedLinkedPostTagsAttr {
  readonly tags: string[];
}

export interface BlogPostProp {
  readonly data: {
    readonly contentfulBlogPost: {
      readonly title: string;
      readonly publishDate: string;
      readonly updatedAt: string;
      readonly sys: {
        readonly revision: number;
      };
      readonly lang: string;
      readonly body: {
        readonly childMarkdownRemark: {
          readonly html: string;
          readonly timeToRead: number;
        };
      };
      readonly description: {
        readonly description: string;
      };
      readonly heroImage: {
        readonly gatsbyImageData: IGatsbyImageData;
        readonly title: string;
        readonly file: {
          readonly url: string;
        };
      };
      readonly tags: Array<string>;
      readonly slug: string;
    };
    readonly site: {
      readonly siteMetadata: {
        readonly siteUrl: string;
        readonly repo: string;
      };
    };
  };
  readonly location: {
    readonly pathname: string;
  };
}

export interface SocialAttr {
  readonly mobile: boolean;
  readonly contacts: ContactsAttr;
}

export interface HeaderAttr {
  readonly siteTitle: string;
}

export interface CommentAttr {
  readonly repo: string;
}

export interface TagsData {
  readonly allContentfulBlogPost: {
    readonly tags: Array<string>;
  };
}

export interface CustomPageProp {
  readonly customPost: CustomPostAttr;
  readonly site: CustomSiteAttr;
}

export interface PaginationAttr {
  readonly totalPageCount: number;
  readonly currentPage: number;
  readonly url: string;
  readonly refine: Function;
}

export interface AnalyticsData {
  readonly allPageViews: {
    readonly nodes: Array<{
      path: string;
    }>;
  };
  readonly allContentfulBlogPost: {
    readonly nodes: Array<{
      readonly slug: string;
      readonly title: string;
    }>;
  };
}

export interface TrendingReport {
  readonly path: string | null | undefined;
  readonly value: number | null | undefined;
}

export interface TopTrendingPageAttr {
  readonly reports: TrendingReport[];
  readonly titleByPath: { [key: string]: string };
}

export interface MostViewedAttr {
  readonly analyticNodePaths: string[];
  readonly titleByPath: { [key: string]: string };
}

export interface RightSidebarAttr {
  readonly analyticNodePaths: string[];
  readonly titleByPath: { [key: string]: string };
  readonly featuredPages: Array<{
    readonly slug: string;
    readonly title: string;
  }>;
  readonly topTrendingReports: TrendingReport[];
}

export interface FeaturedPageAttr {
  readonly featuredPages: Array<{
    readonly slug: string;
    readonly title: string;
  }>;
}

export interface IndexData {
  readonly allContentfulBlogPost: {
    readonly nodes: Array<{
      readonly slug: string;
      readonly body: {
        readonly childMarkdownRemark: {
          readonly timeToRead: number;
          readonly excerpt: string;
        };
      };
      readonly tags: Array<string>;
      readonly title: string;
      readonly publishDate: string;
      readonly heroImage: {
        readonly gatsbyImageData: IGatsbyImageData;
        readonly title: string;
      };
      readonly id: string;
    }>;
    readonly pageInfo: {
      readonly hasNextPage: boolean;
      readonly hasPreviousPage: boolean;
      readonly perPage: number;
      readonly currentPage: number;
      readonly pageCount: number;
      readonly itemCount: number;
    };
  };
  readonly site: {
    readonly siteMetadata: {
      readonly siteUrl: string;
    };
  };
}

export interface PagingLinkAttr {
  readonly disabled: boolean;
  readonly className: string;
  readonly pageNo: number | null;
  readonly onClick?: React.MouseEventHandler;
  readonly text: string;
}

export interface MenuAttr {
  readonly link: string;
  readonly icon: React.ReactNode;
  readonly text: string;
}

export interface FeaturedPageData {
  readonly allContentfulBlogPost: {
    readonly nodes: Array<{
      readonly slug: string;
      readonly title: string;
    }>;
  };
}

export interface IndexContextProp {
  readonly limit: number;
  readonly skip: number;
  readonly tag: string;
  readonly kebabTag: string;
}

export interface ArchiveNode {
  readonly slug: string;
  readonly title: string;
  readonly publishDate: string;
}

export interface IndexProp {
  readonly data: IndexData;
  readonly pageContext: IndexContextProp;
}

export interface ArchiveProp {
  readonly data: ArchiveAttr;
}

export interface ArchiveAttr {
  readonly allContentfulBlogPost: {
    readonly nodes: Array<ArchiveNode>;
  };
}

export interface ArchiveState {
  readonly activeYear: Array<string>;
  readonly activeMonth: Array<string>;
  readonly firstOpen: boolean;
}

export interface DateObject {
  readonly date: string;
  readonly archiveNodes: Array<ArchiveNode>;
}

export interface AlgoliaData {
  readonly data: {
    readonly allContentfulBlogPost: {
      readonly nodes: Array<AlgoliaNode>;
    };
  };
}

export interface AlgoliaNode {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  readonly body: {
    readonly childMarkdownRemark: AlgoliaChildMarkdownRemark;
  };
}

export interface AlgoliaNodeResult {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  readonly excerpt: string;
}

export interface AlgoliaChildMarkdownRemark {
  readonly excerpt: string;
}

export interface FlattenAlgoliaNode {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  readonly excerpt: string;
}
