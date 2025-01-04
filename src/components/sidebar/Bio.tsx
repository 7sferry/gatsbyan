import React from "react";
import "./sidebar.css";
import { graphql, Link, useStaticQuery } from "gatsby";
import { BioAttr } from "../../types/DataTypes";
import Tagline from "./Tagline.tsx";

function getData() {
  return useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);
}

const Bio = ({ author, tagline }: BioAttr) => {
  console.log("woho");
  const data = getData();

  // const x = getArchiveQuery();
  // const photo = Photo;
  // const { file } = useStaticQuery(graphql`
  //   query PhotoBio {
  //     file(relativePath: { eq: "ferry.jpg" }) {
  //       childImageSharp {
  //         original: gatsbyImageData(quality: 100, placeholder: DOMINANT_COLOR, layout: CONSTRAINED)
  //         phone: gatsbyImageData(
  //           quality: 100
  //           placeholder: DOMINANT_COLOR
  //           layout: CONSTRAINED
  //           width: 75
  //           outputPixelDensities: [0.5, 1, 2]
  //         )
  //         ipad: gatsbyImageData(
  //           quality: 100
  //           placeholder: DOMINANT_COLOR
  //           layout: CONSTRAINED
  //           width: 125
  //           outputPixelDensities: [0.5, 1]
  //         )
  //         laptop: gatsbyImageData(
  //           quality: 100
  //           placeholder: DOMINANT_COLOR
  //           layout: CONSTRAINED
  //           width: 250
  //           outputPixelDensities: [1]
  //         )
  //       }
  //     }
  //   }
  // `);
  // const data = withArtDirection(file?.childImageSharp?.original, [
  //   {
  //     media: "(max-width: 416px)",
  //     image: file?.childImageSharp?.phone,
  //   },
  //   {
  //     media: "(max-width: 1024px)",
  //     image: file?.childImageSharp?.ipad,
  //   },
  //   {
  //     media: "(max-width: 1360px)",
  //     image: file?.childImageSharp?.laptop,
  //   },
  // ]);
  return (
    <div className="mobile-bio-main">
      {/*<GatsbyImage image={photo} className="bio-picture" alt="Ferry" title="Ferry Suhandri" />*/}
      <div className="bio-letter">
        <p className="bio-name">
          <Link to={"/blog/berkenalan-dengan-ferry-suhandri"}>{author}</Link>
        </p>
        <Tagline tagline={tagline} />
      </div>
    </div>
  );
};

export default Bio;
