/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

import React, { Component} from 'react';
import { FacebookProvider, Comments, } from "react-facebook";

export default class Comment extends Component {
  render() {
    return (
      <FacebookProvider appId="2050507281848079">
        <Comments href={this.props.href} orderBy="social" mobile={true} width="100%" colorScheme="dark" />
      </FacebookProvider>
    );
  }
}
