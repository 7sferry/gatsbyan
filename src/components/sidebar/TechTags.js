import React from "react";
import { getTechTags } from "../../utils/GatsbyanUtils";

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

  return (
    <>
      <h4 className="mb-1">Tags</h4>
      <div className="d-block">{[...getTechTags(tags)].map(o => (<div className="d-inline-block p-1">{o}</div>))}</div>
    </>
  );
};

export default TechTags;
