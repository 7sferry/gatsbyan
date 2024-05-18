import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./layout.css";
import SiteMetadata from "./SiteMetadata";
import { Slice } from "gatsby";
import Photo from "./Photo.tsx";
import MostViewedCounter from "./MostViewedCounter.tsx";
import FeaturedPageFetcher from "./FeaturedPageFetcher.tsx";
import LeftSidebar from "./sidebar/LeftSidebar.tsx";
import RightSidebar from "./sidebar/RightSidebar.tsx";

const Layout = ({ children }: React.PropsWithChildren<{}>) => {
  const { siteMetadata: metadata } = SiteMetadata();
  const { gatsbyImageData: photo } = Photo();
  const { analyticNodePaths, titleByPath } = MostViewedCounter();
  const { nodes } = FeaturedPageFetcher();

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
              <RightSidebar analyticNodePaths={analyticNodePaths} titleByPath={titleByPath} featuredPages={nodes} />
            </div>
          </div>
        </main>
        <footer className="text-center">
          <div className="mobile-footer">
            <RightSidebar analyticNodePaths={analyticNodePaths} titleByPath={titleByPath} featuredPages={nodes} />
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
