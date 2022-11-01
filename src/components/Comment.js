/************************
 * Made by [MR Ferry™]  *
 * on July 2021         *
 ************************/

import React, { useEffect } from "react";

const src = "https://utteranc.es/client.js";

export const Comment = ({ repo }) => {
  const element = React.createRef();

  useEffect(() => {
    const elementById = document.getElementsByClassName("utterances");
    if(elementById.length > 1){
      return;
    }
    const utterancesScript = document.createElement("script");
    const utterancesConfig = {
      src,
      repo,
      theme: "github-dark-orange",
      label: "komentar",
      async: true,
      "issue-term": "pathname",
      crossorigin: "anonymous",
    };

    Object.keys(utterancesConfig).forEach((configKey) => {
      utterancesScript.setAttribute(configKey, utterancesConfig[configKey]);
    });
    element.current.appendChild(utterancesScript);
  }, [repo, element]);

  return <div className="utterances" ref={element} />;
};
