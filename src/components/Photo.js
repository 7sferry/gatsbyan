import { useStaticQuery, graphql } from "gatsby";

/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

const useSiteMetadata = () => {
  const { file } = useStaticQuery(
    graphql`
        query Bio {
            file(relativePath: { eq: "ferry.jpg" }) {
                childImageSharp {
                    fixed(width: 150, quality: 100, toFormat: WEBP) {
                        width
                        height
                        src
                        srcSet
                        srcSetWebp
                        srcWebp
                        base64
                        tracedSVG
                    }
                }
            }
        }
    `
  );
  return file.childImageSharp;
};

export default useSiteMetadata;
