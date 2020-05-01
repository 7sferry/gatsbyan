import React from "react";
import { StaticQuery, graphql } from "gatsby";
import Bio from "./Bio";
import "./sidebar.css";

import Socials from "../Socials";
import TechTags from "./TechTags";

const Sidebar = () => {
  return (
    <StaticQuery
      query={graphql`
        query SiteBioQuery {
          site {
            siteMetadata {
              title
              tagline
              author
              contacts {
                linkedin
                github
                facebook
                blogger
                crystal
                resume
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
      render={data => (
        <>
          {/*<div style={{position: 'fixed', overflowX: 'hidden', display: 'grid', gridTemplateColumns: '1fr 2fr 1fr',  }}>*/}
          <div className="sidebar-main ">
            <Bio author={data.site.siteMetadata.author} tagline={data.site.siteMetadata.tagline} />
            <Socials mobile={false} contacts={data.site.siteMetadata.contacts} />
            <div className="tech-tags mt-4">
              <TechTags posts={data.allContentfulBlogPost.edges} />
            </div>
          </div>
        {/*</div>*/}
        </>
      )}
    />
  );
};

export default Sidebar;
