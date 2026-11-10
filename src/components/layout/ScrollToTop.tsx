import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// While we're aligning to a section, we stop as soon as the user takes over
const USER_INPUT_EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"];
const MAX_ALIGN_MS = 3000;

/**
 * Scroll handling when the route changes. BrowserRouter doesn't do this on its
 * own, so a new page used to inherit the old scroll offset.
 *
 *  - new path, no hash   -> jump to the top
 *  - hash (e.g. /#contact) -> jump to that section (the element with that id)
 *  - same path, only the query changed (filters) -> leave the scroll alone
 *
 * `behavior: "instant"` overrides the global `scroll-behavior: smooth`.
 */
const ScrollToTop = () => {
  const { pathname, hash, key } = useLocation();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    const pathChanged = lastPath.current !== pathname;
    lastPath.current = pathname;

    if (!hash) {
      if (pathChanged) {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
      return;
    }

    const id = decodeURIComponent(hash.slice(1));
    const align = () =>
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "instant", block: "start" });

    align();

    // Content above the section can still change height after we land (images,
    // lists that load late), which would push the section out of place. So keep
    // re-aligning until the user scrolls on their own or a few seconds pass.
    const observer = new ResizeObserver(align);
    observer.observe(document.documentElement);

    let timer = 0;
    const stop = () => {
      observer.disconnect();
      window.clearTimeout(timer);
      USER_INPUT_EVENTS.forEach((e) => window.removeEventListener(e, stop));
    };
    USER_INPUT_EVENTS.forEach((e) =>
      window.addEventListener(e, stop, { passive: true }),
    );
    timer = window.setTimeout(stop, MAX_ALIGN_MS);

    return stop;
  }, [pathname, hash, key]);

  return null;
};

export default ScrollToTop;
