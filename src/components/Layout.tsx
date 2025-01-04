import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./layout.css";
import { Link } from "gatsby";
import Bio from "./sidebar/Bio.tsx";

const Layout = ({ children }: React.PropsWithChildren<{}>) => {
  // const { siteMetadata: metadata } = ;
  // const photo = Photo();
  // const titleByPath = fetchTitleByPath();
  const mostViewedNodes = [];
  const featuredNodes = [];
  const trendingNodes = [];
  // const { file } = useStaticQuery(graphql`
  //   query PhotoBio {
  //     file(relativePath: { eq: "ferry.jpg" }) {
  //       childImageSharp {
  //         original: gatsbyImageData(quality: 100, placeholder: DOMINANT_COLOR, layout: CONSTRAINED)
  //         phone: gatsbyImageData(
  //           quality: 100
  //           placeholder: DOMINANT_COLOR
  //           layout: CONSTRAINED
  //           width: 75
  //           outputPixelDensities: [0.5, 1, 2]
  //         )
  //         ipad: gatsbyImageData(
  //           quality: 100
  //           placeholder: DOMINANT_COLOR
  //           layout: CONSTRAINED
  //           width: 125
  //           outputPixelDensities: [0.5, 1]
  //         )
  //         laptop: gatsbyImageData(
  //           quality: 100
  //           placeholder: DOMINANT_COLOR
  //           layout: CONSTRAINED
  //           width: 250
  //           outputPixelDensities: [1]
  //         )
  //       }
  //     }
  //   }
  // `);
  // const p = withArtDirection(file?.childImageSharp?.original, [
  //   {
  //     media: "(max-width: 416px)",
  //     image: file?.childImageSharp?.phone,
  //   },
  //   {
  //     media: "(max-width: 1024px)",
  //     image: file?.childImageSharp?.ipad,
  //   },
  //   {
  //     media: "(max-width: 1360px)",
  //     image: file?.childImageSharp?.laptop,
  //   },
  // ]);
  console.log("plp");

  return (
    <>
      {/*<Slice alias="Header" siteTitle={"metadata.title"} />*/}
      <main className="main-layout">
        <section className="sidebar">
          {/*<Slice alias={"Bio"} author={"author"} tagline={"tagline"} />*/}
          <Bio author={"author"} tagline={"tagline"} />
          {/*<LeftSidebar author={"metadata.author"} tagline={"metadata.tagline"} />*/}
        </section>
        <section className="post-main">{<Link to={"/blog/write-skew-pada-database"}>{"author"}</Link>}</section>
        <section className="right-sidebar">
          {/*<Slice*/}
          {/*  alias="RightSidebar"*/}
          {/*  mostViewedNodes={mostViewedNodes}*/}
          {/*  featuredNodes={featuredNodes}*/}
          {/*  trendingNodes={trendingNodes}*/}
          {/*/>*/}
        </section>
      </main>
      <footer className="text-center">
        <div className="my-emoji mb-2">{"metadata.copyright"}</div>
      </footer>
    </>
  );
};

export default Layout;
