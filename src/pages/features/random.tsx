import React, { useState } from "react";
import CustomPageContainer from "../../components/CustomPageContainer.tsx";
import { graphql, useStaticQuery } from "gatsby";
import Seo from "../../components/Seo";
import { CustomPostAttr } from "../../types/DataTypes";
import "../../components/random-generator/RandomGenerator.css";

const pageContext: CustomPostAttr = {
  title: "Random Number Generator",
  description: "Generate a random number between any two values",
  publishDate: "2026-04-13",
  lang: "en",
};

const RandomGenerator = () => {
  const { site } = useStaticQuery(graphql`
    query RandomGeneratorPageQuery {
      site {
        siteMetadata {
          repo
        }
      }
    }
  `);

  const [from, setFrom] = useState("1");
  const [to, setTo] = useState("5");
  const [result, setResult] = useState<number | null>(null);
  const [generating, setGenerating] = useState(false);

  const generate = () => {
    const min = parseInt(from, 10);
    const max = parseInt(to, 10);
    if (isNaN(min) || isNaN(max) || generating) return;
    const low = Math.min(min, max);
    const high = Math.max(min, max);
    setGenerating(true);
    setTimeout(() => {
      setResult(Math.floor(Math.random() * (high - low + 1)) + low);
      setGenerating(false);
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      generate();
    }
  };

  return (
    pageContext && (
      <CustomPageContainer site={site.siteMetadata} customPost={pageContext}>
        <div className="rng-wrapper">
          <div className="rng-card">
            <div className="rng-field">
              <label htmlFor="rng-from">From:</label>
              <input
                id="rng-from"
                type="number"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. 1"
                autoFocus
              />
            </div>
            <div className="rng-field">
              <label htmlFor="rng-to">To:</label>
              <input
                id="rng-to"
                type="number"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. 100"
              />
            </div>
            <button className="rng-button" onClick={generate} type="button">
              Generate
            </button>
            <div className="rng-result">
              {generating ? "Generating…" : result !== null && `Random Number: ${result}`}
            </div>
          </div>
        </div>
      </CustomPageContainer>
    )
  );
};

export async function config() {
  return () => {
    return {
      defer: true,
    };
  };
}

export default RandomGenerator;

export function Head({ location }: any) {
  return (
    <Seo
      title={pageContext?.title}
      description={pageContext?.description}
      lang={pageContext?.lang}
      path={location?.pathname}
    />
  );
}
