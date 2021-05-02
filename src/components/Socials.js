/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

import React from "react";
import { FaLinkedin, FaGithubSquare, FaFacebook, FaStackOverflow } from "react-icons/fa";
import { GiPerson, GiCrystalBall } from "react-icons/gi";
import "./sidebar/sidebar.css";

const buildSocialLink = (contact, title, color, Icon) => {
  return (
    <a className={`${color} p-2`} href={contact} target="_blank" rel="noopener noreferrer">
      <span title={title}>{<Icon size={26} />}</span>
    </a>
  );
};

const Socials = ({ mobile, contacts }) => {
  return (
    <div className={mobile ? `mobile-bio-main mobile-social pt-1` : "side-social-links mt-3 mb-3"}>
      {buildSocialLink(contacts.linkedin, "Linked In", "text-primary", FaLinkedin)}
      {buildSocialLink(contacts.github, "GitHub", "text-light", FaGithubSquare)}
      {buildSocialLink(contacts.facebook, "Facebook", "text-info", FaFacebook)}
      {buildSocialLink(contacts.stackOverFlow, "Blogger", "text-warning", FaStackOverflow)}
      {buildSocialLink(contacts.resume, "Resume", "text-success", GiPerson)}
      {buildSocialLink(contacts.crystal, "Crystal Knows", "text-danger", GiCrystalBall)}
    </div>
  );
};

export default Socials;
