/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react";
import PropTypes from "prop-types";
import { StaticQuery, graphql } from "gatsby";
import "bootstrap/dist/css/bootstrap.css";
import Header from "./header/Header";
import MobileBio from "./header/MobileBio";
import "./layout.css";

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
        }
      `}
      render={data => {
        const metadata = data.site.siteMetadata;
        return (
          <>
            <Header siteTitle={metadata.title} />
            <MobileBio
              author={metadata.author}
              tagline={metadata.tagline}
              contacts={metadata.contacts}
            />
            <div
              style={{
                margin: `0 auto`,
                padding: `0px 1.0875rem 1.45rem`,
                paddingTop: 0,
              }}
            >
              <main className="main-layout">{children}</main>
              <footer className="text-center">
                <hr />
                <p className="d-inline">
                  {metadata.copyright}
                </p>
                <p className="mt-5 text-muted d-inline">
                  <i>
                    {" Powered By "}
                    <a className="text-info" href="https://www.gatsbyjs.org">
                      Gatsby
                    </a>
                  </i>
                </p>
              </footer>
            </div>
          </>
        )
      }}
    />
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
