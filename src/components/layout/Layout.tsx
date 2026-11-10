import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

const Layout = () => {
  // Phones draw their own bar above/below the page. Tint it to match what is at
  // the bottom of the screen: black while the (black) footer is visible, else white.
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    const footer = document.querySelector("footer");
    if (!meta || !footer) return;

    const observer = new IntersectionObserver(
      ([entry]) =>
        meta.setAttribute(
          "content",
          entry.isIntersecting ? "#000000" : "#ffffff",
        ),
      { threshold: 0.1 },
    );
    observer.observe(footer);
    return () => {
      observer.disconnect();
      meta.setAttribute("content", "#ffffff");
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      <ScrollToTop />
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
