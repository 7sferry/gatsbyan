/************************
 * Made by [MR Ferry™]  *
 * on July 2021         *
 ************************/

import React, { useEffect } from "react";
import { CommentAttr } from "../types/DataTypes";
import { isCommentShown } from "../utils/GatsbyanUtils";

const src = "https://utteranc.es/client.js";

export const Comment = ({ repo }: CommentAttr) => {
  const element: React.RefObject<HTMLDivElement> = React.createRef();
  let commentShown = isCommentShown();

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

export default Comment;
