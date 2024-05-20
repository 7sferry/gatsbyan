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
  const photo = Photo();
  const titleByPath = fetchTitleByPath();
  const mostViewedNodes = fetchMostViewed(titleByPath);
  const featuredNodes = fetchFeaturedPages();
  const trendingNodes = fetchTopTrending(titleByPath);

  return (
    <>
      <Slice alias="Header" siteTitle={metadata.title} />
      <div className="body-content">
        <main className="main-layout">
          <div className="index-main">
            <div className="sidebar">
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
          {/*<div className="mobile-footer">{<Slice alias={"Tags"} />}</div>*/}
          <div className="my-emoji mb-2">{metadata.copyright}</div>
        </footer>
      </div>
    </>
  );
};

export default Layout;
