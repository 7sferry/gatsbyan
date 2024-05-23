/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

import { graphql, useStaticQuery } from "gatsby";
import { IGatsbyImageData, withArtDirection } from "gatsby-plugin-image";

const getPhotoBio = (): IGatsbyImageData => {
  const { file } = useStaticQuery(graphql`
    query PhotoBio {
      file(relativePath: { eq: "ferry.jpg" }) {
        childImageSharp {
          original: gatsbyImageData(quality: 100, placeholder: DOMINANT_COLOR, layout: CONSTRAINED)
          phone: gatsbyImageData(
            quality: 100
            placeholder: DOMINANT_COLOR
            layout: CONSTRAINED
            width: 75
            outputPixelDensities: [0.5, 1, 2]
          )
          ipad: gatsbyImageData(
            quality: 100
            placeholder: DOMINANT_COLOR
            layout: CONSTRAINED
            width: 125
            outputPixelDensities: [0.5, 1]
          )
          laptop: gatsbyImageData(
            quality: 100
            placeholder: DOMINANT_COLOR
            layout: CONSTRAINED
            width: 250
            outputPixelDensities: [1]
          )
        }
      }
    }
  `);
  return withArtDirection(file?.childImageSharp?.original, [
    {
      media: "(max-width: 416px)",
      image: file?.childImageSharp?.phone,
    },
    {
      media: "(max-width: 1024px)",
      image: file?.childImageSharp?.ipad,
    },
    {
      media: "(max-width: 1360px)",
      image: file?.childImageSharp?.laptop,
    },
  ]);
};

export default getPhotoBio;
