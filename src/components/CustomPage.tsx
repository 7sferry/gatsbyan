/************************
 * Author: [MR FERRY™]  *
 * September 2022       *
 ************************/

import Layout from "./Layout";
import React from "react";
import { Comment } from "./Comment";
import { getPostTags, getPublishDateTime } from "../utils/GatsbyanUtils";
import { CustomPostAttr } from "../../custom-post-by-slug";

class CustomPage extends React.Component<React.PropsWithChildren<CustomPageProp>, CustomPageState> {
  constructor(props: React.PropsWithChildren<CustomPageProp>) {
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
    const { children, site, customPost }: React.PropsWithChildren<CustomPageProp> = this.props;
    const repo = site.repo;
    return (
      <Layout>
        <div>
          <div className="post-main">
            <div className="title posted">{customPost.title}</div>
            <div className="title text-info mb-2">
              <span className="page-info">{getPublishDateTime(customPost.publishDate)}</span>
              <span className="page-info">{getPostTags(null)}</span>
            </div>
            <div className="post-container pt-0 content-post">{children}</div>
            {this.state.commentShown && repo && <Comment repo={repo} />}
          </div>
        </div>
      </Layout>
    );
  }
}

interface CustomPageProp {
  customPost: CustomPostAttr;
  site: CustomSiteAttr;
}

export interface CustomSiteAttr {
  url: string;
  repo: string;
}

interface CustomPageState {
  commentShown: boolean;
}

export default CustomPage;
