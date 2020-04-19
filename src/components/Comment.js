/************************
 * Made by [MR Ferry™]  *
 * on April 2020        *
 ************************/

import React, { Component} from 'react';
import { FacebookProvider, Comments, } from "react-facebook";

export default class Comment extends Component {
  render() {
    return (
      <FacebookProvider href={this.props.href} appId="2050507281848079">
        <Comments orderBy="social" mobile={true} width="100%" colorScheme="dark" />
      </FacebookProvider>
    );
  }
}
