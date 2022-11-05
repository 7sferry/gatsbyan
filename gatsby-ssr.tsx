/************************
 * Made by [MR Ferry™]  *
 * on May 2020          *
 ************************/

export function onPreRenderHTML({ getHeadComponents, replaceHeadComponents }: any) {
  const headComponents = getHeadComponents();
  const styleHeadComponents = headComponents.filter((component: { type: string }) => component.type === "style");
  const nonStyleHeadComponents = headComponents.filter((component: { type: string }) => component.type !== "style");
  replaceHeadComponents([nonStyleHeadComponents, styleHeadComponents]);
}
