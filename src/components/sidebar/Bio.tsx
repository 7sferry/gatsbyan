import React from "react";
import "./sidebar.css";
import { StaticImage } from "gatsby-plugin-image";
import { Link } from "gatsby";
import { BioAttr } from "../../types/DataTypes";

const Bio = ({ author, tagline }: BioAttr) => {
  // const { gatsbyImageData: photo } = Photo();
  return (
    <div>
      <StaticImage
        src={"https://ferry.vercel.app/ferry-suhandri.jpg"}
        className="profile-img"
        alt="Ferry"
        title="Ferry Suhandri"
      />
      <div className="mt-2 author-bio second-header">
        <Link to={"/blog/berkenalan-dengan-ferry-suhandri"}>{author}</Link>
      </div>
      <small className="muted">{tagline}</small>
    </div>
  );
};

export default Bio;
