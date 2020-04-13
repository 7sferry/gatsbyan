import React from "react";
import { Link } from "gatsby";

const TechTags = props => {
  const posts = props.posts;
  const tags = new Set();
  if(posts){
    posts.forEach(post =>{
      if(post.node.tags){
        post.node.tags.forEach(tag =>{
          tags.add(tag);
        });
      }
    });
  }

  const getTechTags = tags => {
    const techTags = [];
    tags.forEach(tag => {
      techTags.push(
        <div key={tag} className="d-inline-block p-1">
          <Link to={`/tags/${tag}`}>{tag}</Link>
        </div>
      );
    });
    return techTags;
  };

  return (
    <>
      <h4 className="mb-1">Tags</h4>
      <div className="d-block">{getTechTags(tags)}</div>
    </>
  );
};

export default TechTags;
