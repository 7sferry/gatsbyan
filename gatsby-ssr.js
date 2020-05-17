/************************
 * Made by [MR Ferry™]  *
 * on May 2020          *
 ************************/

exports.onPreRenderHTML = ({ getHeadComponents, replaceHeadComponents }) => {
  const headComponents = getHeadComponents();
  const styleHeadComponents = headComponents.filter(component => component.type === "style");
  const nonStyleHeadComponents = headComponents.filter(component => component.type !== "style");
  replaceHeadComponents([nonStyleHeadComponents, styleHeadComponents]);
};
