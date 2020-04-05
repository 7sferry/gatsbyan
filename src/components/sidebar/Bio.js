import React from "react";
import "./sidebar.css";
import Photo from "../Photo";
import Img from "gatsby-image";

const Bio = ({ author, tagline }) => {
  const { fixed: photo } = Photo();
  return (
    <div className="bio-main w-75">
      <Img className="profile-img" fixed={photo} alt="Ferry" title="Ferry Suhandri" />
      <h3 className="mt-2 author-bio">{author}</h3>
      <small className="text-muted">{tagline}</small>
    </div>
  );
};

export default Bio;
