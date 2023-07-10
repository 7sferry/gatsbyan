/************************
 * Made by [MR Ferry™]  *
 * on Juli 2023         *
 ************************/

import React from "react";
import { ComponentPreview, Previews } from "@react-buddy/ide-toolbox";
import { PaletteTree } from "./palette";
import { Head } from "../pages/blog/value-averaging-calculator";

const ComponentPreviews = () => {
  return (
    <Previews palette={<PaletteTree />}>
      <ComponentPreview path="/Head">
        <Head />
      </ComponentPreview>
    </Previews>
  );
};

export default ComponentPreviews;
