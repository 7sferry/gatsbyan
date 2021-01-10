import React from "react";
import Photo from "../Photo";
import Img from "gatsby-image";
import "./header.css";
import Socials from "../Socials";

const MobileBio = props => {
  const { fixed: photo } = Photo();
  return (
    <>
      <Socials mobile={true} contacts={props.contacts} />
      <div className="mobile-bio-main">
        <Img fixed={photo} className="bio-picture" alt="author-pic" />
        <div className="bio-letter">
          <p className="bio-name">{props.author}</p>
          <small>{props.tagline}</small>
        </div>
      </div>
    </>
  );
};

export default MobileBio;
