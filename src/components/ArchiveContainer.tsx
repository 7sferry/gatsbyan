/************************
 * Made by [MR Ferry™]  *
 * on Januari 2025      *
 ************************/

import { ArchiveNode, DateArchive } from "../types/DataTypes.ts";
import { Link } from "gatsby";
import React, { useState } from "react";
import { getMonthYearDate } from "../utils/DateUtils.tsx";
import { getArchiveQuery } from "../utils/GetArchiveQuery.tsx";

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
                {/*<MdArchive />*/}
                <svg xmlns="http://www.w3.org/2000/svg" height="20" width="22.5" viewBox="0 0 576 512">
                  <path
                    fill="#ffffff"
                    d="M384 480l48 0c11.4 0 21.9-6 27.6-15.9l112-192c5.8-9.9 5.8-22.1 .1-32.1S555.5 224 544 224l-400 0c-11.4 0-21.9 6-27.6 15.9L48 357.1 48 96c0-8.8 7.2-16 16-16l117.5 0c4.2 0 8.3 1.7 11.3 4.7l26.5 26.5c21 21 49.5 32.8 79.2 32.8L416 144c8.8 0 16 7.2 16 16l0 32 48 0 0-32c0-35.3-28.7-64-64-64L298.5 96c-17 0-33.3-6.7-45.3-18.7L226.7 50.7c-12-12-28.3-18.7-45.3-18.7L64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l23.7 0L384 480z"
                  />
                </svg>
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
