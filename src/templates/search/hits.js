/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

import React from "react";
import { Link } from "gatsby";
import { connectHits } from "react-instantsearch-dom";

const Hits = connectHits(({ hits}) => {
  return (
    <div>
      {hits.length > 0 ? (
        <>
          {hits.map(hit => {
            return (
              <div key={hit.objectID}>
                <Link className="text-link" to={`/blog/${hit.slug}`}>
                  <h3 className="title">{hit.title}</h3>
                </Link>
                <div>
                  <p>{hit.excerpt}</p>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <>
          <p>There were no results yet.</p>
        </>
      )}
    </div>
  );
});

export default Hits;
