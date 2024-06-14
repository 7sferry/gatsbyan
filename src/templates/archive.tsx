/************************
 * Made by [MR Ferry™]  *
 * on May 2020          *
 ************************/

import React, { useState } from "react";
import { HeadProps, Link } from "gatsby";
import { MdArchive } from "react-icons/md";
import "./archive.css";
import { getMonthYearDate } from "../utils/GatsbyanUtils";
import Layout from "../components/Layout";
import Seo from "../components/Seo";
import { ArchiveNode, ArchiveState, DateObject } from "../types/DataTypes";
import { getArchiveQuery } from "../utils/GetArchiveQuery.tsx";

const ArchivePage = () => {
  let pageQuery1 = getArchiveQuery();
  const { allContentfulBlogPost } = pageQuery1;
  const posts = allContentfulBlogPost.nodes;
  if (posts.length === 0) {
    return <></>;
  }

  const lastDate = getMonthYearDate(posts[0].publishDate);
  const [archiveState, setArchiveState] = useState<ArchiveState>({
    activeMonth: [lastDate],
    activeYear: [lastDate.split("-")[0]],
    firstOpen: false,
  });

  const toggleActiveYear = (index: string) => {
    let newActiveYear = [...archiveState.activeYear];
    let newActiveMonth = [...archiveState.activeMonth];

    if (newActiveYear.includes(index)) {
      newActiveYear = newActiveYear.filter((o) => o !== index);
      newActiveMonth = newActiveMonth.filter((o) => {
        const monthYear = o.split("-");
        return monthYear[0] !== index;
      });
    } else {
      newActiveYear.push(index);
    }

    setArchiveState({ activeMonth: newActiveMonth, activeYear: newActiveYear, firstOpen: false });
  };

  const toggleActiveMonth = (index: string) => {
    let newActiveMonth = [...archiveState.activeMonth];

    if (newActiveMonth.includes(index)) {
      newActiveMonth = newActiveMonth.filter((o) => o !== index);
    } else {
      newActiveMonth.push(index);
    }

    setArchiveState({ activeMonth: newActiveMonth, activeYear: archiveState.activeYear, firstOpen: false });
  };

  let postByMonth = new Map<string, ArchiveNode[]>();
  if (posts) {
    posts.forEach((o) => {
      const monthYearDate = getMonthYearDate(o.publishDate);
      let post = postByMonth.get(monthYearDate);
      if (post) {
        post.push(o);
      } else {
        post = [o];
      }
      postByMonth.set(monthYearDate, post);
    });
  }

  let postByYear = new Map<string, DateObject[]>();
  postByMonth.forEach((v, k) => {
    const yearMonth = k.split("-");
    let year = yearMonth[0];
    let post = postByYear.get(year);
    const object = { date: k, archiveNodes: v };
    if (post) {
      post.push(object);
    } else {
      post = [object];
    }
    postByYear.set(year, post);
  });

  return (
    <Layout>
      <ul className="archive-container parent-archive-container">
        {Array.from(postByYear.entries()).map((post, i) => {
          const year = post[0];
          return (
            <li key={i} className={"item"}>
              <button className={`archive-link`} onClick={() => toggleActiveYear(year)}>
                <i className="archive-icon">
                  <MdArchive />
                </i>
                <span>{year}</span>
              </button>

              <ul className={`archive-container ${archiveState.activeYear.includes(year) ? "visible" : "not-visible"}`}>
                {post[1].map((contents) => {
                  const month = contents.date.split("-")[1];
                  return (
                    <li key={month} className={"item"}>
                      <button className="archive-link" onClick={() => toggleActiveMonth(contents.date)}>
                        <span>{month}</span>
                      </button>
                      <ul
                        className={`archive-container ${
                          archiveState.activeMonth.includes(contents.date) ? "visible" : "not-visible"
                        }`}
                      >
                        {contents.archiveNodes.map((content) => {
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
    </Layout>
  );
};

export default ArchivePage;

export function Head({ location }: HeadProps) {
  return <Seo title={"Archive"} path={location?.pathname} />;
}
