import React from "react";
import { graphql, Link, useStaticQuery } from "gatsby";
import { kebab as kebabCase } from "case";

const Tags = () => {
  const { allContentfulBlogPost } = useStaticQuery(
    graphql`
      query Tags {
        allContentfulBlogPost(sort: {fields: tags, order: ASC}) {
          tags: distinct(field: tags)
        }
      }
    `
  );

  function presentTags() {
    return (
      <div className="d-block">
        {allContentfulBlogPost.tags.map((tag, i) => (
          <div key={i} className="d-inline-block p-1 tag-link">
            <Link to={`/tags/${kebabCase(tag)}`}>{tag}</Link>
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

export default Tags;
