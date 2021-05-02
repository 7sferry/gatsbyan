/************************
 * Made by [MR Ferry™]  *
 * on May 2021          *
 ************************/

import { useStaticQuery, graphql } from "gatsby";

const useSiteMetadata = () => {
  const { site } = useStaticQuery(
    graphql`
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
    `
  );
  return site;
};

export default useSiteMetadata;
