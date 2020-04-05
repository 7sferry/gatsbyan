import React from "react";
import { Link } from "gatsby";

const Menu = () => {
  return (
    <div className="social-links float-right mr-4">
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

export default Menu;
