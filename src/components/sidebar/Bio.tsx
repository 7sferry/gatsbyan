import React from "react";
import "./sidebar.css";
import { GatsbyImage } from "gatsby-plugin-image";
import { Link } from "gatsby";
import { BioAttr } from "../../types/DataTypes";

const Bio = ({ author, tagline, photo }: BioAttr) => {
  return (
    <div className="mobile-bio-main">
      <GatsbyImage image={photo} className="bio-picture" alt="Ferry" title="Ferry Suhandri" />
      <div className="bio-letter">
        <p className="bio-name">
          <Link to={"/blog/berkenalan-dengan-ferry-suhandri"}>{author}</Link>
        </p>
        <small>{tagline}</small>
      </div>
    </div>
  );
};

export default Bio;
