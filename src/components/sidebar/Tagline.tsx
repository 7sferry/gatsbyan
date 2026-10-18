/************************
 * Made by [MR Ferry™]  *
 * on Mei 2024          *
 ************************/
import React from "react";
import { TaglineAttr } from "../../types/DataTypes.ts";

const Tagline = ({ tagline }: TaglineAttr) => {
  return (
    <>
      <small className={"expanded"}>{tagline}</small>
    </>
  );
};

export default Tagline;
