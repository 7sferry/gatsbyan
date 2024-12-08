/************************
 * Made by [MR Ferry™]  *
 * on Desember 2024     *
 ************************/

import { getPublishDateTime } from "../utils/GatsbyanUtils.tsx";
import React from "react";

export default function PublishDate(props: { date: string }) {
  return <span className="page-info">{getPublishDateTime(props.date)}</span>;
}
