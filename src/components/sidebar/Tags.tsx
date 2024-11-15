import React from "react";
import { Link } from "gatsby";
import { kebabCase } from "../../utils/GatsbyanUtils";
import { TagsData } from "../../types/DataTypes";
import { getTagsQuery } from "../../utils/GetTagsQuery.tsx";

const Tags = () => {
  const { allContentfulBlogPost }: TagsData = getTagsQuery();

  return (
    <>
      <div className="second-header mb-1">Tags</div>
      <div className="d-block">
        {allContentfulBlogPost.tags.map((tag, i) => (
          <div key={i} className="d-inline-block p-1 tag-link">
            <Link to={`/tags/${kebabCase(tag)}`}>{tag}</Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default Tags;
