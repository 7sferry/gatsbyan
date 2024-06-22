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
import { ArchiveNode, DateArchive } from "../types/DataTypes";
import { getArchiveQuery } from "../utils/GetArchiveQuery.tsx";

const ArchivePage = () => {
  let archiveQuery = getArchiveQuery();
  const { allContentfulBlogPost } = archiveQuery;
  const posts = allContentfulBlogPost.nodes;
  if (posts.length === 0) {
    return (
      <Layout>
        <></>
      </Layout>
    );
  }

  const lastDate = getMonthYearDate(posts[0].publishDate);
  const [activeMonth, setActiveMonth] = useState<string[]>([lastDate]);
  const [activeYear, setActiveYear] = useState<string[]>([lastDate.split("-")[0]]);

  const toggleActiveYear = (year: string) => {
    let newActiveYear = [...activeYear];
    let newActiveMonth = [...activeMonth];

    if (newActiveYear.includes(year)) {
      newActiveYear = newActiveYear.filter((o) => o !== year);
      newActiveMonth = newActiveMonth.filter((o) => {
        const yearMonth = o.split("-");
        return yearMonth[0] !== year;
      });
    } else {
      newActiveYear.push(year);
    }

    setActiveMonth(newActiveMonth);
    setActiveYear(newActiveYear);
  };

  const toggleActiveMonth = (yearMonth: string) => {
    let newActiveMonth = [...activeMonth];

    if (newActiveMonth.includes(yearMonth)) {
      newActiveMonth = newActiveMonth.filter((o) => o !== yearMonth);
    } else {
      newActiveMonth.push(yearMonth);
    }

    setActiveMonth(newActiveMonth);
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

  let postByYear = new Map<string, DateArchive[]>();
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
          let dateArchives = post[1];
          return (
            <li key={i} className={"item"}>
              <button className={`archive-link`} onClick={() => toggleActiveYear(year)}>
                <i className="archive-icon">
                  <MdArchive />
                </i>
                <span>{year}</span>
              </button>

              <ul className={`archive-container ${activeYear.includes(year) ? "visible" : "not-visible"}`}>
                {dateArchives.map((dateArchive) => {
                  const month = dateArchive.date.split("-")[1];
                  return (
                    <li key={month} className={"item"}>
                      <button className="archive-link" onClick={() => toggleActiveMonth(dateArchive.date)}>
                        <span>{month}</span>
                      </button>
                      <ul
                        className={`archive-container ${
                          activeMonth.includes(dateArchive.date) ? "visible" : "not-visible"
                        }`}
                      >
                        {dateArchive.archiveNodes.map((content) => {
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
