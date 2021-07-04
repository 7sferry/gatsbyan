/************************
 * Made by [MR Ferry™]  *
 * on July 2021         *
 ************************/

import React, { useEffect } from "react";

const src = "https://utteranc.es/client.js";

export const Utterances = ({ repo }) => {
  const element = React.createRef();

  useEffect(() => {
    const utterancesScript = document.createElement("script");
    const utterancesConfig = {
      src,
      repo,
      theme: "github-dark-orange",
      label: "komentar",
      async: true,
      "issue-term": "url",
      crossorigin: "anonymous",
    };

    Object.keys(utterancesConfig).forEach((configKey) => {
      utterancesScript.setAttribute(configKey, utterancesConfig[configKey]);
    });
    element.current.appendChild(utterancesScript);
  }, [repo, element]);

  return <div className="utterances" ref={element} />;
};
