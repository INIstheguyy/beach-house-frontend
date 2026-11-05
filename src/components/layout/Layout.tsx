import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      <ScrollToTop />
      <Header />

      <main className="flex-1 pt-2 md:pt-2">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
