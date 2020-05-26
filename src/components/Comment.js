/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

import React, { Component } from "react";
import { FacebookProvider, Comments } from "react-facebook";

export default class Comment extends Component {
  render() {
    return (
      <FacebookProvider appId="1365740643629290">
        <Comments href={this.props.href} orderBy="reverse_time" mobile={true} width="100%" colorScheme="dark" />
      </FacebookProvider>
    );
  }
}
