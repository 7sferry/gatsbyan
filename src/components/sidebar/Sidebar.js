import React from "react";
import { StaticQuery, graphql } from "gatsby";
import Bio from "./Bio";
import "./sidebar.css";

import SocialLinks from "./SocialLinks";
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
          <div className="sidebar-main ">
            <Bio
              author={data.site.siteMetadata.author}
              tagline={data.site.siteMetadata.tagline}
            />
            <SocialLinks contacts={data.site.siteMetadata.contacts} />
            <div className="tech-tags mt-4">
              <TechTags
                posts={data.allContentfulBlogPost.edges}
              />
            </div>
          </div>
        </>
      )}
    />
  );
};

export default Sidebar;
