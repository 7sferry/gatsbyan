/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

import { useStaticQuery, graphql } from "gatsby";

const useSiteMetadata = () => {
  const { file } = useStaticQuery(
    graphql`
      query PhotoBio {
        file(relativePath: { eq: "ferry.jpg" }) {
          childImageSharp {
            fixed(width: 150, quality: 100) {
              width
              height
              src
              srcSet
              srcSetWebp
              srcWebp
              base64
            }
          }
        }
      }
    `
  );
  return file.childImageSharp;
};

export default useSiteMetadata;
