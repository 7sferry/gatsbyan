/************************
 * Made by [MR Ferry™]  *
 * on Mei 2024          *
 ************************/

import React from "react";
import { Link } from "gatsby";
import { kebabCase } from "../utils/GatsbyanUtils.tsx";
import { CommaSeparatedLinkedPostTagsAttr } from "../types/DataTypes.ts";

const CommaSeparatedLinkedPostTags = ({ tags }: CommaSeparatedLinkedPostTagsAttr) => {
  const techTags = new Set<React.ReactNode>();
  tags?.forEach((tag, i) => {
    const kebabTag = kebabCase(tag);
    techTags.add(
      <span key={kebabTag}>
        {i > 0 ? ", " : ""}
        <Link to={`/tags/${kebabTag}`}>{tag}</Link>
      </span>
    );
  });

  return <>{techTags}</>;
};

export default CommaSeparatedLinkedPostTags;
