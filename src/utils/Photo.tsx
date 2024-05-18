/************************
 * Made by [MR Ferry™]  *
 * on Mei 2024          *
 ************************/

/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

import { graphql, useStaticQuery } from "gatsby";

const getPhotoBio = () => {
  const { file } = useStaticQuery(graphql`
    query PhotoBio {
      file(relativePath: { eq: "ferry.jpg" }) {
        childImageSharp {
          gatsbyImageData(quality: 100, placeholder: DOMINANT_COLOR, layout: CONSTRAINED)
        }
      }
    }
  `);
  return file.childImageSharp;
};

export default getPhotoBio;
