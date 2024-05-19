/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

import { graphql, useStaticQuery } from "gatsby";
import { withArtDirection } from "gatsby-plugin-image";

const getPhotoBio = () => {
  const { file, small } = useStaticQuery(graphql`
    query PhotoBio {
      file: file(relativePath: { eq: "ferry.jpg" }) {
        childImageSharp {
          gatsbyImageData(quality: 100, placeholder: DOMINANT_COLOR, layout: CONSTRAINED)
        }
      }
      small: file(relativePath: { eq: "ferry.jpg" }) {
        childImageSharp {
          gatsbyImageData(quality: 100, placeholder: DOMINANT_COLOR, layout: CONSTRAINED, height: 75)
        }
      }
    }
  `);
  return withArtDirection(file?.childImageSharp?.gatsbyImageData, [
    {
      media: "(max-width: 1024px)",
      image: small?.childImageSharp?.gatsbyImageData,
    },
  ]);
};

export default getPhotoBio;
