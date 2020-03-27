import React from "react";
import {
  FaLinkedin,
  FaGithubSquare,
  FaFacebook,
  FaBloggerB,
} from "react-icons/fa";
import { GiPerson, GiCrystalBall } from "react-icons/gi";

import "../layout.css"

const buildSocialLink = (contact, title, color, icon) => {
  return (
    <a className={`text-${color}`}
       href={contact}
      target="_blank"
       rel="noopener noreferrer"
    >
                <span title={title}>
                  {icon}
                </span>
    </a>
  );
};

const MobileSocialLinks = ({ contacts }) => {
    return (
        <div className="mobile-bio-main mobile-social pt-1">
          {buildSocialLink(contacts.linkedin, "Linked In", "primary", <FaLinkedin size={26}/>)}
          {buildSocialLink(contacts.github, "GitHub", "light", <FaGithubSquare size={26}/>)}
          {buildSocialLink(contacts.facebook, "Facebook", "info", <FaFacebook size={26}/>)}
          {buildSocialLink(contacts.blogger, "Blogger", "warning", <FaBloggerB size={26}/>)}
          {buildSocialLink(contacts.resume, "Resume", "success", <GiPerson size={26}/>)}
          {buildSocialLink(contacts.crystal, "Crystal Knows", "danger", <GiCrystalBall size={26}/>)}
        </div>
    )
}

export default MobileSocialLinks;
