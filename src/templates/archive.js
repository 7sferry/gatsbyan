/************************
 * Made by [MR Ferry™]  *
 * on May 2020          *
 ************************/

import React from "react";
import { Link, graphql } from "gatsby";
import { MdArchive } from "react-icons/md";
import "./archive.css";
import { getMonthYearDate } from "../utils/GatsbyanUtils";
import Layout from "../components/Layout";

class ArchivePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeYear: [], activeMonth: [], firstOpen: true };
    this.toggleActiveYear = this.toggleActiveYear.bind(this);
  }

  toggleActiveYear(index) {
    let activeYear = this.state.activeYear;
    let activeMonth = this.state.activeMonth;

    if (activeYear.includes(index)) {
      activeYear = activeYear.filter(o => o !== index);
      activeMonth = activeMonth.filter(o => {
        const monthYear = o.split("-");
        return monthYear[0] !== index;
      });
    } else {
      activeYear.push(index);
    }

    this.setState(() => ({
      activeYear: activeYear,
      activeMonth: activeMonth,
      firstOpen: false,
    }));
  }

  toggleActiveMonth(index) {
    let activeMonth = this.state.activeMonth;

    if (activeMonth.includes(index)) {
      activeMonth = activeMonth.filter(o => o !== index);
    } else {
      activeMonth.push(index);
    }

    this.setState(() => ({
      activeMonth: activeMonth,
      activeYear: this.state.activeYear,
      firstOpen: false,
    }));
  }

  render() {
    const posts = this.props.data.allContentfulBlogPost.nodes;
    let postByMonth = new Map();
    let lastDate = "";
    posts.forEach((o, i) => {
      const monthYearDate = getMonthYearDate(o.publishDate);
      if (i === 1) lastDate = monthYearDate;
      let post = postByMonth.get(monthYearDate);
      if (post) {
        post.push(o);
      } else {
        post = [o];
      }
      postByMonth.set(monthYearDate, post);
    });

    let postByYear = new Map();
    postByMonth.forEach((v, k) => {
      const yearMonth = k.split("-");
      let year = yearMonth[0];
      let post = postByYear.get(year);
      const object = { date: k, object: v };
      if (post) {
        post.push(object);
      } else {
        post = [object];
      }
      postByYear.set(year, post);
    });

    this.state.firstOpen && this.state.activeYear.push(lastDate.split("-")[0]) && this.state.activeMonth.push(lastDate);

    return (
      <Layout>
        <div>
          <ul className="archive-container parent-archive-container">
            {Array.from(postByYear.entries()).map((post, i) => {
              const year = post[0];
              return (
                <li key={i} className={"item"}>
                  <button className={`archive-link`} onClick={() => this.toggleActiveYear(year)}>
                    <i className="archive-icon" style={{ display: "inline-block" }}>
                      <MdArchive />
                    </i>
                    <span>{year}</span>
                  </button>

                  <ul className={`archive-container ${this.state.activeYear.includes(year) ? "visible" : ""}`}>
                    {post[1].map(contents => {
                      const month = contents.date.split("-")[1];
                      return (
                        <li key={month} className={"item"}>
                          <button className="archive-link" onClick={() => this.toggleActiveMonth(contents.date)}>
                            <span>{month}</span>
                          </button>
                          <ul
                            className={`archive-container ${this.state.activeMonth.includes(contents.date) ? "visible" : ""}`}
                          >
                            {contents.object.map(content => {
                              return (
                                <li className={"item"} key={content.slug}>
                                  <Link className={"archive-link"} to={`/blog/${content.slug}`}>
                                    <small>{content.title}</small>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      </Layout>
    );
  }
}

export const pageQuery = graphql`
  query ArchiveQuery {
    allContentfulBlogPost(sort: { order: DESC, fields: publishDate }) {
      nodes {
        slug
        title
        publishDate
      }
    }
  }
`;

export default ArchivePage;
