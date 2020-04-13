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
      <div className="mobile-bio-main" style={{paddingBottom: "1.45rem"}}>
        <Img
          fixed={photo}
          className="ml-4 mt-2"
          style={{ maxWidth: `75px`, maxHeight: `75px`, borderRadius: `50%`, boxShadow: `1px 1px 3px` }}
          alt="author-pic"
        />
        <div className="ml-3 mt-2 mb-0">
          <p className="mb-1">{props.author}</p>
          <small>{props.tagline}</small>
        </div>
      </div>
    </>
  );
};

export default MobileBio;
