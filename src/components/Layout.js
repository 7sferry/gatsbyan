/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react";
import PropTypes from "prop-types";
import LeftSidebar from "../components/sidebar/LeftSidebar";
import RightSidebar from "../components/sidebar/RightSidebar";
import { StaticQuery, graphql } from "gatsby";
import "bootstrap/dist/css/bootstrap.css";
import Header from "./header/Header";
import MobileBio from "./header/MobileBio";
import "./layout.css";
import Tags from "./sidebar/Tags";
import { Sign } from "./Sign";

Sign();
const Layout = ({ children }) => {
  return (
    <StaticQuery
      query={graphql`
        query SiteTitleQuery {
          site {
            siteMetadata {
              title
              tagline
              author
              copyright
              contacts {
                linkedin
                github
                facebook
                resume
                blogger
                crystal
              }
            }
          }
          allContentfulBlogPost {
            edges {
              node {
                tags
              }
            }
          }
        }
      `}
      render={data => {
        const metadata = data.site.siteMetadata;
        const { allContentfulBlogPost: post } = data;
        return (
          <>
            <Header siteTitle={metadata.title} />
            <MobileBio author={metadata.author} tagline={metadata.tagline} contacts={metadata.contacts} />
            <div className="body-content">
              <main className="main-layout">
                <div className="index-main">
                  <div className="sidebar border-right px-4 py-2">
                    <LeftSidebar />
                  </div>
                  {children}
                  <div className="right-sidebar">
                    <RightSidebar />
                  </div>
                </div>
              </main>
              <footer className="text-center">
                <div className="mobile-footer mt-4">
                  <RightSidebar />
                </div>
                <div className="mobile-footer">
                  <Tags posts={post.edges} />
                  <hr />
                </div>
                <div>
                  <p className="d-inline my-emoji">{metadata.copyright}</p>
                </div>
              </footer>
            </div>
          </>
        );
      }}
    />
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
