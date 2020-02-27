import React from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"


import MobileMenuLinks from "./MobileMenuLinks"
import SocialLinks from "./SocialLinks"
import "./header.css"

const Header = ({ siteTitle, tagline, contacts }) => {

  return (
    <header
      className="head-main"
    >
      <div className="head-elements"
        style={{
          margin: `0`,
          padding: `.75rem`
        }}
      >
        <h1 className="head-logo ml-4" style={{ margin: 0 }}>
          <Link
            to="/"
            style={{
              color: `white`,
              textDecoration: `none`,
            }}
          >
            {siteTitle}
          </Link>
        </h1>
        <SocialLinks contacts={contacts} />
      </div>
      <MobileMenuLinks/>
    </header>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
