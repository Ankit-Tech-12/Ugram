import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-bg text-text">
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;