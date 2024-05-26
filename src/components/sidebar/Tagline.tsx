/************************
 * Made by [MR Ferry™]  *
 * on Mei 2024          *
 ************************/
import React, { useEffect, useRef, useState } from "react";
import { TaglineAttr } from "../../types/DataTypes.ts";

const Tagline = ({ tagline }: TaglineAttr) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const paragraphRef = useRef(null);
  const [isTwoLines, setIsTwoLines] = useState(false);

  useEffect(() => {
    const checkIfTwoLines = () => {
      if (paragraphRef.current) {
        const { scrollHeight } = paragraphRef.current;
        const lineHeight = parseInt(window.getComputedStyle(paragraphRef.current).lineHeight, 15);

        if (lineHeight * 2 < scrollHeight) {
          setIsTwoLines(true);
        } else {
          setIsTwoLines(false);
        }
      }
    };

    checkIfTwoLines();
    window.addEventListener("resize", checkIfTwoLines);

    return () => {
      window.removeEventListener("resize", checkIfTwoLines);
    };
  }, [tagline]);

  const toggleExpansion = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e?.preventDefault();
    setIsExpanded(!isExpanded);
  };
  return (
    <>
      <small ref={paragraphRef} className={isExpanded ? "expanded" : "truncated"}>
        {tagline}
      </small>
      {isTwoLines && (
        <a style={{ fontSize: "85%" }} href={"#"} onClick={(e) => toggleExpansion(e)}>
          {isExpanded ? "Read less" : "Read more"}
        </a>
      )}
    </>
  );
};

export default Tagline;
