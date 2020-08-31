import React from "react";
import { getTechTags } from "../../utils/GatsbyanUtils";

const TechTags = props => {
  const posts = props.posts;
  const tags = new Set();
  if (posts) {
    posts.forEach(post => {
      if (post.node.tags) {
        post.node.tags.forEach(tag => {
          tags.add(tag);
        });
      }
    });
  }

  function presentAllTags() {
    return (
      <div className="d-block">
        {[...getTechTags(tags)].map((o, i) => (
          <div key={i} className="d-inline-block p-1">
            {o}
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="second-header mb-1">Tags</div>
      {presentAllTags()}
    </>
  );
};

export default TechTags;
