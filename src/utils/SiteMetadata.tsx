/************************
 * Made by [MR Ferry™]  *
 * on May 2021          *
 ************************/

import { graphql, useStaticQuery } from "gatsby";

const useSiteMetadata = () => {
  const { site } = useStaticQuery(graphql`
    query SiteMetadata {
      site {
        siteMetadata {
          title
          tagline
          author
          copyright
        }
      }
    }
  `);
  return site;
};

export default useSiteMetadata;
