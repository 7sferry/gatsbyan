/************************
 * Made by [MR Ferry™]  *
 * on Januari 2025      *
 ************************/

import React from "react";

export const MySvg = (props: { size?: number; color?: string; title?: string; path: string; viewBox: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height={props.size ?? "1em"}
    width={props.size ?? "1em"}
    viewBox={props.viewBox}
  >
    {props.title && <title>{props.title}</title>}
    <path fill={props.color ?? "currentColor"} d={props.path} />
  </svg>
);
