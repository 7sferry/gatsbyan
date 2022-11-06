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
            gatsbyImageData(quality: 100, placeholder: DOMINANT_COLOR, layout: CONSTRAINED)
          }
        }
      }
    `
  );
  return file.childImageSharp;
};

export default useSiteMetadata;
