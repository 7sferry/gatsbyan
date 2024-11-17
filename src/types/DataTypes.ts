import { IGatsbyImageData } from "gatsby-plugin-image";
import React, { ChangeEventHandler } from "react";
import { IconType } from "react-icons/lib";

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
  readonly stockCacheValueByName: Map<string, StockData>;
  readonly stockName: string;
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

export interface TaglineAttr {
  readonly tagline: string;
}

export interface LeftSidebarAttr {
  readonly photo: {};
  readonly author: string;
  readonly tagline: string;
}

export interface ContactsAttr {
  readonly name: string;
  readonly icon: IconType;
  readonly url: string;
  readonly color: string;
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

export interface BlogPostHeroImage {
  readonly original: IGatsbyImageData;
  readonly phone: IGatsbyImageData;
  readonly ipad: IGatsbyImageData;
  readonly laptop: IGatsbyImageData;
  readonly title: string;
  readonly file: {
    readonly url: string;
  };
}

export interface ContentfulBlogPost {
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
  readonly heroImage: BlogPostHeroImage;
  readonly tags: Array<string>;
  readonly slug: string;
}

export interface BlogPostProp {
  readonly data: {
    readonly contentfulBlogPost: ContentfulBlogPost;
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
  readonly contacts: ContactsAttr[];
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
  readonly refine?: (page: number) => void;
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
  readonly path: string;
  readonly value: number;
}

export interface TrendingNode {
  readonly path: string;
  readonly title: string;
}

export interface TrendingPageAttr {
  readonly trendingNodes: TrendingNode[];
}

export interface MostViewedNode {
  readonly path: string;
  readonly title: string;
}

export interface MostViewedAttr {
  readonly mostViewedNodes: MostViewedNode[];
}

export interface RightSidebarAttr {
  readonly mostViewedNodes: MostViewedNode[];
  readonly featuredNodes: Array<{
    readonly slug: string;
    readonly title: string;
  }>;
  readonly trendingNodes: TrendingNode[];
}

export interface FeaturedPageAttr {
  readonly featuredNodes: Array<{
    readonly slug: string;
    readonly title: string;
  }>;
}

export interface IndexHeroImage {
  readonly original: IGatsbyImageData;
  readonly phone: IGatsbyImageData;
  readonly ipad: IGatsbyImageData;
  readonly laptop: IGatsbyImageData;
  readonly title: string;
}

export interface IndexData extends IndexHeroImage {
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
      readonly heroImage: IndexHeroImage;
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

export interface DateArchive {
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

export interface PaginationProp {
  readonly previousPage: number;
  readonly nextPage: number;
  readonly pageStart: number;
  readonly pageLimit: number;
}

export interface StockNameProps {
  onChange: ChangeEventHandler<HTMLInputElement>;
  stockName: string;
  stockCacheValueByName: Map<string, StockData>;
}
