import React from "react";
import { Link } from "gatsby";

import "../layout.css";

const MobileMenuLinks = () => {
  return (
    <div className="bottom-bar py-1">
      <Link to="/">
        <span className="text-side d-block ml-4">Blog Home</span>
      </Link>
      <Link to="/about">
        <span className="text-side d-block ml-4">About</span>
      </Link>
      <Link to="/archive">
        <span className="text-side d-block ml-4">Archive</span>
      </Link>
    </div>
  );
};

export default MobileMenuLinks;
