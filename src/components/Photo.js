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
            gatsbyImageData(width: 150, quality: 100, placeholder: TRACED_SVG, layout: FIXED)
          }
        }
      }
    `
  );
  return file.childImageSharp;
};

export default useSiteMetadata;
