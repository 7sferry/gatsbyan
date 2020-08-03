/************************
 * Made by [MR Ferry™]  *
 * on May 2020          *
 ************************/

export function onPreRenderHTML({ getHeadComponents, replaceHeadComponents }) {
  const headComponents = getHeadComponents();
  const styleHeadComponents = headComponents.filter(component => component.type === "style");
  const nonStyleHeadComponents = headComponents.filter(component => component.type !== "style");
  replaceHeadComponents([nonStyleHeadComponents, styleHeadComponents]);
}
