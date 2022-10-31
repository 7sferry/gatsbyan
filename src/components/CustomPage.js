/************************
 * Author: [MR FERRY™]  *
 * September 2022       *
 ************************/

import Layout from "../components/Layout";
import Seo from "../components/Seo";
import "../templates/ignored/blockquote.css";
import "../templates/ignored/index-ignored.css";
import React from "react";
import { Comment } from "./Comment";
import { getPostTags, getPublishDateTime } from "../utils/GatsbyanUtils";

class CustomPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { commentShown: false };
    this.showComment = this.showComment.bind(this);
  }

  showComment() {
    this.setState(() => ({
      commentShown: true,
    }));
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const innerHeight = window.innerHeight + document.documentElement.scrollTop;
    const clientHeight = document.body.clientHeight;
    const percentage = (innerHeight / clientHeight) * 100;
    if (!this.state.commentShown && percentage > 50) {
      this.showComment();
    }
  };

  render() {
    let { children, site, customPost } = this.props;
    const repo = site.repo;
    return (
      <Layout>
        <Seo
          title={customPost.title}
          description={customPost.description}
          lang={customPost.lang}
          image={`${site.url}/ferry-suhandri.jpg`}
          url={customPost.slug}
        />
        <div>
          <div className="post-main">
            <div className="title posted">{customPost.title}</div>
            <div className="title text-info mb-2">
              <span className="page-info">{getPublishDateTime(customPost.publishDate)}</span>
              <span className="page-info">{getPostTags(null)}</span>
            </div>
            <div className="post-container pt-0" id="content-post">
              {children}
            </div>
            {this.state.commentShown && repo && <Comment repo={repo} />}
          </div>
        </div>
      </Layout>
    );
  }
}

export default CustomPage;