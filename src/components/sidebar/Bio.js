import React from "react";
import "./sidebar.css";
import { StaticQuery, graphql } from "gatsby";
import Img from "gatsby-image";

const PhotoImage = (
  <StaticQuery
    query={graphql`
      query Bio {
        file(relativePath: { eq: "ferry.jpg" }) {
          childImageSharp {
            fixed(width: 150, quality: 100) {
              width
              height
              src
              srcSet
              srcSetWebp
              base64
            }
          }
        }
      }
    `}
    render={data => (
      <Img
        className="profile-img"
        fixed={data.file.childImageSharp.fixed}
        alt="Ferry"
        title="Ferry Suhandri"
      />
    )}
  />
);

const Bio = ({ author, tagline }) => {
  return (
    <div className="bio-main w-75">
      {PhotoImage}
      <h3 className="mt-2 author-bio">{author}</h3>
      <small className="text-muted">{tagline}</small>
    </div>
  );
};

export default Bio;
