import React from "react";
import "./sidebar.css";
import Photo from "../Photo";
import Img from "gatsby-image";

const Bio = ({ author, tagline }) => {
  const { fixed: photo } = Photo();
  return (
    <div>
      <Img className="profile-img" fixed={photo} alt="Ferry" title="Ferry Suhandri" />
      <div className="mt-2 author-bio second-header">{author}</div>
      <small className="muted">{tagline}</small>
    </div>
  );
};

export default Bio;
