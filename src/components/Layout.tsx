import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./layout.css";
import { Slice } from "gatsby";
import LeftSidebar from "./sidebar/LeftSidebar.tsx";
import { Footer } from "./Footer.tsx";

const Layout = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <>
      <Slice alias="Header" />
      <main className="main-layout">
        <section className="sidebar">
          <LeftSidebar />
        </section>
        <section className="post-main">{children}</section>
        <section className="right-sidebar">
          <Slice alias="RightSidebar" />
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Layout;
