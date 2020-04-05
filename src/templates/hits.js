/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

import React from "react";
import { Link } from "gatsby";
import { connectHits } from "react-instantsearch-dom";

const Hits = connectHits(({ hits }) => (
  <div>
    {hits.length ? (
      <>
        {hits.map(hit => {
          return (
            <div key={hit.slug}>
              <Link className="text-link" to={`/blog/${hit.slug}`}>
                <h3 className="title">{hit.title}</h3>
              </Link>
              <div>
                <p>{hit.description}</p>
              </div>
            </div>
          );
        })}
      </>
    ) : (
      <p>There were no results for your query. Please try again.</p>
    )}
  </div>
));

export default Hits;
