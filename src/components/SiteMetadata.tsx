/************************
 * Made by [MR Ferry™]  *
 * on May 2021          *
 ************************/

import { graphql, useStaticQuery } from "gatsby";

const useSiteMetadata = () => {
  // console.log("metadata " + Math.random());
  const { site } = useStaticQuery(graphql`
    query SiteMetadata {
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
            stackOverFlow
            crystal
          }
        }
      }
    }
  `);
  return site;
};

export default useSiteMetadata;
