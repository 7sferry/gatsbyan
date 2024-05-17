import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./layout.css";
import Tags from "./sidebar/Tags";
import SiteMetadata from "./SiteMetadata";
import { Slice } from "gatsby";

const Layout = ({ children }: React.PropsWithChildren<{}>) => {
  const { siteMetadata: metadata } = SiteMetadata();
  return (
    <>
      <Slice alias="Header" siteTitle={metadata.title} />
      <Slice alias="MobileBio" author={metadata.author} tagline={metadata.tagline} contacts={metadata.contacts} />
      <div className="body-content">
        <main className="main-layout">
          <div className="index-main">
            <div className="sidebar border-right px-4 py-2">
              <Slice alias="LeftSidebar" />
            </div>
            {children}
            <div className="right-sidebar">
              <Slice alias="RightSidebar" />
            </div>
          </div>
        </main>
        <footer className="text-center">
          <div className="mobile-footer">
            <Slice alias="RightSidebar" />
          </div>
          <div className="mobile-footer">
            <Tags />
          </div>
          <div className="my-emoji mt-2">{metadata.copyright}</div>
        </footer>
      </div>
    </>
  );
};

export default Layout;
