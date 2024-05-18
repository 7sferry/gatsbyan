import React from "react";
import { GatsbyImage } from "gatsby-plugin-image";
import "./header.css";
import { Link } from "gatsby";
import { MobileBioAttr } from "../../types/DataTypes";
import MobileSocials from "./MobileSocials.tsx";

const MobileBio = (props: MobileBioAttr) => {
  return (
    <>
      <MobileSocials mobile={true} contacts={props.contacts} />
      <div className="mobile-bio-main">
        <GatsbyImage image={props.photo} className="bio-picture" alt="author-pic" />
        <div className="bio-letter">
          <p className="bio-name second-header">
            <Link to={"/blog/berkenalan-dengan-ferry-suhandri"}>{props.author}</Link>
          </p>
          <small>{props.tagline}</small>
        </div>
      </div>
    </>
  );
};

export default MobileBio;
