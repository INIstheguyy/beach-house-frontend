import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Resets the window scroll to the top whenever the route path changes.
 *
 * BrowserRouter doesn't do this on its own, so a new page used to inherit the
 * old scroll offset (and landed on the footer while content was still loading).
 * We depend on `pathname` only, so changing filters (query params) won't jump.
 * `behavior: "instant"` overrides the global `scroll-behavior: smooth`.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
