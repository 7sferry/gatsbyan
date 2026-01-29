/************************
 * Made by [MR Ferry™]  *
 * on July 2021         *
 ************************/

import React, { useEffect } from "react";
import { CommentAttr } from "../types/DataTypes";

const src = "https://utteranc.es/client.js";

export const Comment = ({ repo }: CommentAttr) => {
  const element: React.RefObject<HTMLDivElement | null> = React.createRef();
  const commentShown = isCommentShown();

  useEffect(() => {
    if (!commentShown) {
      return;
    }
    const elementById = document.getElementsByClassName("utterances");
    if (elementById.length > 1) {
      return;
    }
    const utterancesScript = document.createElement("script");
    const utterancesConfig = new Map<string, string>([
      ["src", src],
      ["repo", repo],
      ["theme", "github-dark-orange"],
      ["label", "komentar"],
      ["async", "true"],
      ["issue-term", "pathname"],
      ["crossorigin", "anonymous"],
    ]);
    utterancesConfig.forEach((value, key) => {
      utterancesScript.setAttribute(key, value);
    });

    element?.current?.appendChild(utterancesScript);
  }, [commentShown, repo, element]);

  return <div className="utterances" ref={element} />;
};

function isCommentShown() {
  const [commentShown, setCommentShown] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    const innerHeight = window.innerHeight + document.documentElement.scrollTop;
    const clientHeight = document.body.clientHeight;
    const percentage = (innerHeight / clientHeight) * 100;
    if (!commentShown && percentage > 50) {
      setCommentShown(true);
    }
  };
  return commentShown;
}

export default Comment;
