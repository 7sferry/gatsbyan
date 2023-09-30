import React from "react";
import "./sidebar.css";
import Photo from "../Photo";
import { GatsbyImage } from "gatsby-plugin-image";
import { Link } from "gatsby";
import { BioAttr } from "../../types/DataTypes";

const Bio = ({ author, tagline }: BioAttr) => {
  const { gatsbyImageData: photo } = Photo();
  return (
    <div>
      <GatsbyImage image={photo} className="profile-img" alt="Ferry" title="Ferry Suhandri" />
      <div className="mt-2 author-bio second-header">
        <Link to={"/blog/berkenalan-dengan-ferry-suhandri"}>{author}</Link>
      </div>
      <small className="muted">{tagline}</small>
    </div>
  );
};

export default Bio;
