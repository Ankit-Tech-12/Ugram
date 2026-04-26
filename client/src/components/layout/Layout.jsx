import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";

const Layout = ({children}) => {
  return (
    <div className="min-h-screen bg-bg text-text">
      <Navbar />

    <main>{children}</main>

      <Outlet />
    </div>
  );
};

export default Layout;