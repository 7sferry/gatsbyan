/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

import React from "react";
import "./sidebar/sidebar.css";
import { ContactsAttr } from "../types/DataTypes";
import { FaGithubSquare, FaInstagram, FaLinkedin, FaStackOverflow, FaUserGraduate } from "react-icons/fa";
import { GiCrystalBall } from "react-icons/gi";

const contacts: ContactsAttr[] = [
  {
    name: "LinkedIn",
    icon: FaLinkedin,
    url: "https://www.linkedin.com/in/7sferry",
    color: "#0a66c2",
  },
  {
    name: "GitHub",
    icon: FaGithubSquare,
    url: "https://github.com/7sferry",
    color: "white",
  },
  {
    name: "Instagram",
    icon: FaInstagram,
    url: "https://www.instagram.com/7sferry/",
    color: "#e1306c",
  },
  {
    name: "StackOverFlow",
    icon: FaStackOverflow,
    url: "https://stackoverflow.com/users/14286378/ferry",
    color: "#ef8236",
  },
  {
    name: "Resume",
    icon: FaUserGraduate,
    url: "https://ferry.netlify.app",
    color: "#34A210FF",
  },
  {
    name: "CrystalKnow",
    icon: GiCrystalBall,
    url: "https://www.crystalknows.com/p/ferry",
    color: "#2ca7e4",
  },
];

const Socials = () => {
  return (
    <div className={`mobile-bio-main mobile-social`}>
      {contacts.map((contact) => {
        return (
          <a className={`social-icon`} href={contact.url} target="_blank" rel="noopener noreferrer" key={contact.name}>
            <span title={contact.name}>{<contact.icon size={26} color={contact.color} />}</span>
          </a>
        );
      })}
    </div>
  );
};

export default Socials;
