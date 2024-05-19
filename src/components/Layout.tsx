import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./layout.css";
import SiteMetadata from "../utils/SiteMetadata.tsx";
import { Slice } from "gatsby";
import Photo from "../utils/Photo.tsx";
import { fetchMostViewed } from "../utils/MostViewedCounter.tsx";
import { fetchFeaturedPages } from "../utils/FeaturedPageFetcher.tsx";
import LeftSidebar from "./sidebar/LeftSidebar.tsx";
import { fetchTopTrending } from "../utils/TopTrendingFetcher.tsx";
import fetchTitleByPath from "../utils/AllPostFetcher.tsx";

const Layout = ({ children }: React.PropsWithChildren<{}>) => {
  const { siteMetadata: metadata } = SiteMetadata();
  const { gatsbyImageData: photo } = Photo();
  const titleByPath = fetchTitleByPath();
  const mostViewedNodes = fetchMostViewed(titleByPath);
  const featuredNodes = fetchFeaturedPages();
  const trendingNodes = fetchTopTrending(titleByPath);

  return (
    <>
      <Slice alias="Header" siteTitle={metadata.title} />
      <Slice alias={"Socials"} mobile={true} contacts={metadata.contacts} />
      <Slice alias="MobileBio" author={metadata.author} tagline={metadata.tagline} photo={photo} />
      <div className="body-content">
        <main className="main-layout">
          <div className="index-main">
            <div className="sidebar border-right px-4 py-2">
              <LeftSidebar
                photo={photo}
                author={metadata.author}
                tagline={metadata.tagline}
                contacts={metadata.contacts}
              />
            </div>
            {children}
            <div className="right-sidebar">
              <Slice
                alias="RightSidebar"
                mostViewedNodes={mostViewedNodes}
                featuredNodes={featuredNodes}
                trendingNodes={trendingNodes}
              />
            </div>
          </div>
        </main>
        <footer className="text-center">
          <div className="mobile-footer">
            <Slice
              alias="RightSidebar"
              mostViewedNodes={mostViewedNodes}
              featuredNodes={featuredNodes}
              trendingNodes={trendingNodes}
            />
          </div>
          <div className="mobile-footer">
            <Slice alias={"Tags"} />
          </div>
          <div className="my-emoji mt-2">{metadata.copyright}</div>
        </footer>
      </div>
    </>
  );
};

export default Layout;
