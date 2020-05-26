import PropTypes from "prop-types";
import React from "react";

import { FaTwitter, FaLinkedin, FaFacebook, FaEnvelope } from "react-icons/fa";
import { ShareBlockStandard, ShareButtonIconOnly } from "react-custom-share";

const Share = props => {
  const { url, title, siteName } = props;

  const shareBlockProps = {
    url: url,
    button: ShareButtonIconOnly,
    buttons: [
      { network: "Twitter", icon: FaTwitter },
      { network: "Facebook", icon: FaFacebook },
      { network: "Linkedin", icon: FaLinkedin },
      { network: "Email", icon: FaEnvelope },
    ],
    text: title,
    longtext: siteName,
  };
  return (
    <div className="mt-4">
      <ShareBlockStandard {...shareBlockProps} />
      <p className="text-center">
        <i>Share it if you like it!</i>
      </p>
    </div>
  );
};

Share.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  siteName: PropTypes.string,
};

Share.defaultProps = {
  url: "https://ferry.now.sh/",
  title: "Ferry Suhandri",
  siteName: "MR Ferry",
};

export default Share;
