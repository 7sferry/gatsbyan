/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

import React from "react";
import { FaLinkedin, FaGithubSquare, FaFacebook, FaBloggerB } from "react-icons/fa";
import { GiPerson, GiCrystalBall } from "react-icons/gi";
import "./sidebar/sidebar.css";

const buildSocialLink = (contact, title, color, Icon) => {
  return (
    <a className={`text-${color} p-2`} href={contact} target="_blank" rel="noopener noreferrer">
      <span title={title}>{<Icon size={26} />}</span>
    </a>
  );
};

const Socials = ({ mobile, contacts }) => {
  return (
    <div className={mobile ? `mobile-bio-main mobile-social pt-1` : "side-social-links float-left mt-3 mb-3"}>
      {buildSocialLink(contacts.linkedin, "Linked In", "primary", FaLinkedin)}
      {buildSocialLink(contacts.github, "GitHub", "light", FaGithubSquare)}
      {buildSocialLink(contacts.facebook, "Facebook", "info", FaFacebook)}
      {buildSocialLink(contacts.blogger, "Blogger", "warning", FaBloggerB)}
      {buildSocialLink(contacts.resume, "Resume", "success", GiPerson)}
      {buildSocialLink(contacts.crystal, "Crystal Knows", "danger", GiCrystalBall)}
    </div>
  );
};

export default Socials;
