import React from "react";
import Photo from "../Photo";
import { GatsbyImage } from "gatsby-plugin-image";
import "./header.css";
import Socials, { ContactsAttr } from "../Socials";
import { Link } from "gatsby";

const MobileBio = (props: MobileBioAttr) => {
  const { gatsbyImageData: photo } = Photo();
  return (
    <>
      <Socials mobile={true} contacts={props.contacts} />
      <div className="mobile-bio-main">
        <GatsbyImage image={photo} className="bio-picture" alt="author-pic" />
        <div className="bio-letter">
          <p className="bio-name">
            <Link to={"/blog/berkenalan-dengan-ferry-suhandri"}>{props.author}</Link>
          </p>
          <small>{props.tagline}</small>
        </div>
      </div>
    </>
  );
};

export interface MobileBioAttr {
  contacts: ContactsAttr;
  author: string;
  tagline: string;
}

export default MobileBio;
