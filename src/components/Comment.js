/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

import React, { Component } from "react";
import { FacebookProvider, Comments } from "react-facebook";

export default class Comment extends Component {
  render() {
    return (
      <div style={{ position: "relative" }}>
        <p style={{ position: "absolute", left: "50%" }}>LOADING...</p>
        <div style={{ zIndex: 9 }}>
          <FacebookProvider appId="1365740643629290">
            <Comments
              style={{ zIndex: 9 }}
              href={this.props.href}
              orderBy="reverse_time"
              mobile={true}
              width="100%"
              colorScheme="dark"
            />
          </FacebookProvider>
        </div>
      </div>
    );
  }
}
