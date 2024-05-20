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
          phone: gatsbyImageData(quality: 100, placeholder: DOMINANT_COLOR, layout: CONSTRAINED, width: 75)
          #          ipad: gatsbyImageData(quality: 100, placeholder: DOMINANT_COLOR, layout: CONSTRAINED, height: 125)
          #          notebook: gatsbyImageData(quality: 100, placeholder: DOMINANT_COLOR, layout: CONSTRAINED, height: 235)
          laptop: gatsbyImageData(quality: 100, placeholder: DOMINANT_COLOR, layout: CONSTRAINED, width: 250)
          #          pc: gatsbyImageData(quality: 100, placeholder: DOMINANT_COLOR, layout: CONSTRAINED, height: 270)
          #          tv: gatsbyImageData(quality: 100, placeholder: DOMINANT_COLOR, layout: CONSTRAINED, height: 380)
        }
      }
    }
  `);
  return withArtDirection(file?.childImageSharp?.original, [
    {
      media: "(max-width: 416px)",
      image: file?.childImageSharp?.phone,
    },
    // {
    //   media: "(max-width: 980px)",
    //   image: file?.childImageSharp?.ipad,
    // },
    // {
    //   media: "(max-width: 1280px)",
    //   image: file?.childImageSharp?.notebook,
    // },
    {
      media: "(max-width: 1366px)",
      image: file?.childImageSharp?.laptop,
    },
    // {
    //   media: "(max-width: 1440px)",
    //   image: file?.childImageSharp?.pc,
    // },
    // {
    //   media: "(max-width: 1910px)",
    //   image: file?.childImageSharp?.tv,
    // },
  ]);
};

export default getPhotoBio;
