import React from "react";
import { useLocation } from "react-router-dom";
const Navbar = React.lazy(() => import("../Navbar/Navbar"));
const Dark = React.lazy(() => import("../Dark/Dark"));
const Layout = () => {
  const location = useLocation();

  const isChatPage = location.pathname === "/chat";

  return (
    <>
      {!isChatPage && <Navbar />}
      <Dark />
    </>
  );
};

export default Layout;
