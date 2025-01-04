import React from "react";
import "./sidebar.css";
import { GatsbyImage } from "gatsby-plugin-image";
import { Link } from "gatsby";
import Tagline from "./Tagline.tsx";
import SiteMetadata from "../../utils/SiteMetadata.tsx";
import Photo from "../../utils/Photo.tsx";

const Bio = () => {
  const photo = Photo();
  const { siteMetadata: metadata } = SiteMetadata();
  return (
    <div className="mobile-bio-main">
      <GatsbyImage image={photo} className="bio-picture" alt="Ferry" title="Ferry Suhandri" />
      <div className="bio-letter">
        <p className="bio-name">
          <Link to={"/blog/berkenalan-dengan-ferry-suhandri"}>{metadata.author}</Link>
        </p>
        <Tagline tagline={metadata.tagline} />
      </div>
    </div>
  );
};

export default Bio;
