/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

import React from "react";
import { FaFacebook, FaGithubSquare, FaLinkedin, FaStackOverflow, FaUserGraduate } from "react-icons/fa";
import { GiCrystalBall } from "react-icons/gi";
import "../sidebar/sidebar.css";
import { IconType } from "react-icons/lib";
import { SocialAttr } from "../../types/DataTypes";

const Socials = ({ contacts }: SocialAttr) => {
  return (
    <div className={`mobile-bio-main mobile-social`}>
      {buildMobileSocialLink(contacts.linkedin, "LinkedIn", "text-primary", FaLinkedin)}
      {buildMobileSocialLink(contacts.github, "GitHub", "text-light", FaGithubSquare)}
      {buildMobileSocialLink(contacts.facebook, "Facebook", "text-info", FaFacebook)}
      {buildMobileSocialLink(contacts.stackOverFlow, "StackOverFlow", "text-warning", FaStackOverflow)}
      {buildMobileSocialLink(contacts.resume, "Resume", "text-danger", FaUserGraduate)}
      {buildMobileSocialLink(contacts.crystal, "CrystalKnows", "text-success", GiCrystalBall)}
    </div>
  );
};

const buildMobileSocialLink = (contact: string, title: string, color: string, Icon: IconType) => {
  return (
    <a className={`${color}`} href={contact} target="_blank" rel="noopener noreferrer">
      <span title={title}>{<Icon size={26} />}</span>
    </a>
  );
};

export default Socials;
