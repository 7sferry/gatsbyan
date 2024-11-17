/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

import React from "react";
import "./sidebar/sidebar.css";
import { ContactsAttr } from "../types/DataTypes";
import siteConfig from "../config.ts";

const Socials = () => {
  let contacts: ContactsAttr[] = siteConfig.author.contacts;
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
