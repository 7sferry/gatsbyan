import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import { getTags } from "../../utils/GatsbyanUtils";

const Tags = () => {
  const { allContentfulBlogPost }: TagsData = useStaticQuery(
    graphql`
      query Tags {
        allContentfulBlogPost {
          tags: distinct(field: { tags: SELECT })
        }
      }
    `
  );

  function presentTags() {
    return (
      <div className="d-block">
        {allContentfulBlogPost.tags.map((tag, i) => (
          <div key={i} className="d-inline-block p-1 tag-link">
            {getTags(tag)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="second-header mb-1">Tags</div>
      {presentTags()}
    </>
  );
};

interface TagsData {
  allContentfulBlogPost: {
    tags: Array<string>;
  };
}

export default Tags;
