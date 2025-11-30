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
          original: gatsbyImageData(
            formats: [NO_CHANGE, AVIF]
            quality: 75
            placeholder: DOMINANT_COLOR
            layout: CONSTRAINED
            avifOptions: { lossless: true, speed: 1 }
          )
          phone: gatsbyImageData(
            formats: [NO_CHANGE, AVIF]
            quality: 90
            placeholder: DOMINANT_COLOR
            layout: CONSTRAINED
            width: 75
            outputPixelDensities: [0.5, 1, 2]
            avifOptions: { lossless: true, speed: 1 }
          )
          ipad: gatsbyImageData(
            formats: [NO_CHANGE, AVIF]
            quality: 90
            placeholder: DOMINANT_COLOR
            layout: CONSTRAINED
            width: 125
            outputPixelDensities: [0.5, 1]
            avifOptions: { lossless: true, speed: 1 }
          )
          laptop: gatsbyImageData(
            formats: [NO_CHANGE, AVIF]
            quality: 90
            placeholder: DOMINANT_COLOR
            layout: CONSTRAINED
            width: 250
            outputPixelDensities: [1]
            avifOptions: { lossless: true, speed: 1 }
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
