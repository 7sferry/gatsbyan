/************************
 * Author: [MR FERRY™]  *
 * September 2022       *
 ************************/

import Layout from "../components/Layout";
import Seo from "../components/Seo";
import "./ignored/blockquote.css";
import "./ignored/index-ignored.css";
import React from "react";
import { graphql } from "gatsby";
import { Comment } from "../components/Comment";
import Vca from "../components/VcaFormCalculator";
import { getPostTags, getPublishDateTime } from "../utils/GatsbyanUtils";

class BlogPostTemplate extends React.Component{
  constructor(props){
    super(props);
    this.state = { commentShown: false };
    this.showComment = this.showComment.bind(this);
  }

  showComment(){
    this.setState(() => ({
      commentShown: true
    }));
  }

  componentDidMount(){
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount(){
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const innerHeight = window.innerHeight + document.documentElement.scrollTop;
    const clientHeight = document.body.clientHeight;
    const percentage = innerHeight / clientHeight * 100;
    if(!this.state.commentShown && percentage > 50){
      this.showComment();
    }
  };

  render(){
    const site = this.props.data.site.siteMetadata;
    const repo = site.repo;

    return (
      <Layout>
        <Seo
          title={this.props.pageContext.title}
          description={this.props.pageContext.description}
          lang={this.props.pageContext.lang}
          image={`${site.siteUrl}/ferry-suhandri.jpg`}
          url={this.props.pageContext.slug}
        />
        <div>
          <div className="post-main">
            <div className="title posted">{this.props.pageContext.title}</div>
            <div className="title text-info mb-2">
              <span className="page-info">{getPublishDateTime(this.props.pageContext.publishDate)}</span>
              <span className="page-info">{getPostTags(null)}</span>
            </div>
            <div
              className="post-container pt-0"
              id="content-post"
            >
              {this.props.pageContext.slug === "/blog/value-averaging-calculator" && <Vca />}
            </div>
            {this.state.commentShown && repo && <Comment repo={repo} />}
          </div>
        </div>
      </Layout>
    );
  }
}

export default BlogPostTemplate;

export const pageQuery = graphql`
    query BlogPostBSlug {
        site {
            siteMetadata {
                siteUrl
                repo
            }
        }
    }
`;
