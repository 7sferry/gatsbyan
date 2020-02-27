import React from "react"
import {
    FaLinkedin,
    FaGithubSquare,
    FaFacebook,
    FaBloggerB
} from "react-icons/fa"
import {
    GiPerson,
    GiCrystalBall
} from "react-icons/gi"
import "./sidebar.css"


const SocialLinks = ({ contacts }) => {
    return (
        <div className="side-social-links float-left mt-3 mb-3">
            <a className="text-primary p-2"
               href={contacts.linkedin}>
                <span title="Linked In">
                    <FaLinkedin size={26} style={{ color: "primary" }} />
                </span>
            </a>
            <a className="text-light p-2"
               href={contacts.github}>
                <span title="GitHub">
                    <FaGithubSquare size={26} style={{ color: "light" }} />
                </span>
            </a>
            <a className="text-info p-2"
               href={contacts.facebook}>
                <span title="Facebook">
                    <FaFacebook size={26} style={{ color: "success" }} />
                </span>
            </a>
            <a className="text-warning p-2"
               href={contacts.blogger}>
                <span title="Blogger">
                    <FaBloggerB size={26} style={{ color: "info" }} />
                </span>
            </a>
            <a className="text-success p-2"
               href={contacts.resume}>
                <span title="Resume">
                    <GiPerson size={26} style={{ color: "info" }} />
                </span>
            </a>
            <a className="text-danger p-2"
               href={contacts.crystal}>
                <span title="Crystal Knows">
                    <GiCrystalBall size={26} style={{ color: "info" }} />
                </span>
            </a>
        </div>
    )
}

export default SocialLinks
