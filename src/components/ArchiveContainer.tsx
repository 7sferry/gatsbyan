/************************
 * Made by [MR Ferry™]  *
 * on Januari 2025      *
 ************************/

import { ArchiveNode, DateArchive } from "../types/DataTypes.ts";
import { Link } from "gatsby";
import React, { useState } from "react";
import { getMonthYearDate } from "../utils/DateUtils.tsx";
import { getArchiveQuery } from "../utils/GetArchiveQuery.tsx";
import MySvg from "./MySvg.tsx";

const ArchiveContainer = () => {
  let archiveQuery = getArchiveQuery();
  const { allContentfulBlogPost } = archiveQuery;
  const posts = allContentfulBlogPost.nodes;
  if (posts.length === 0) {
    return <></>;
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
    <ul className="archive-container parent-archive-container">
      {Array.from(postByYear.entries()).map((post, i) => {
        const year = post[0];
        let dateArchives = post[1];
        return (
          <li key={i} className={"item"}>
            <button className={`archive-link`} onClick={() => toggleActiveYear(year)}>
              <i className="archive-icon">
                <MySvg
                  viewBox={"0 0 576 512"}
                  path={
                    "M88.7 223.8L0 375.8 0 96C0 60.7 28.7 32 64 32l117.5 0c17 0 33.3 6.7 45.3 18.7l26.5 26.5c12 12 28.3 18.7 45.3 18.7L416 96c35.3 0 64 28.7 64 64l0 32-336 0c-22.8 0-43.8 12.1-55.3 31.8zm27.6 16.1C122.1 230 132.6 224 144 224l400 0c11.5 0 22 6.1 27.7 16.1s5.7 22.2-.1 32.1l-112 192C453.9 474 443.4 480 432 480L32 480c-11.5 0-22-6.1-27.7-16.1s-5.7-22.2 .1-32.1l112-192z"
                  }
                />
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
  );
};

export default ArchiveContainer;
