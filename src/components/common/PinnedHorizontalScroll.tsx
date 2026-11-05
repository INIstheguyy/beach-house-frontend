import {
  Children,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

// The pinned stage fills the screen under the floating header (top: 6rem)
// with a small margin at the bottom. On tall screens (tablets) it stops at 42rem
// so the cards don't turn into very tall strips.
export const PINNED_STAGE_HEIGHT = "min(calc(100svh - 7.5rem), 42rem)";

// Tuning knobs for how the section feels:
// - SCROLL_PER_PX: px of vertical scroll needed per px of sideways movement.
//   1 = cards move exactly with your finger, 1.5 = slower, 2 = even slower.
// - SPRING: how the cards "glide" to catch up with your scroll position.
//   Lower stiffness / higher damping = softer and more delayed.
const SCROLL_PER_PX = 1.5;
const SPRING = { stiffness: 90, damping: 28, mass: 0.5, restDelta: 0.0005 };

const ITEM_WIDTH = "w-[85vw] md:w-[60vw] shrink-0";

const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

interface PinnedHorizontalScrollProps {
  /** The cards. Each one should fill its box (h-full w-full). */
  children: ReactNode;
  /**
   * Reduced-motion users get a normal swipeable carousel instead, where the
   * cards have no stage to stretch into. Give each one a size here
   * (e.g. "aspect-[4/3]" or "h-[420px]").
   */
  fallbackItemClassName?: string;
}

// Fallback for people who prefer reduced motion: a normal swipeable carousel.
const SnapCarousel = ({
  items,
  itemClassName,
}: {
  items: ReactNode[];
  itemClassName?: string;
}) => (
  <div className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-8">
    {items.map((item, i) => (
      <div key={i} className={cn(ITEM_WIDTH, "snap-center", itemClassName)}>
        {item}
      </div>
    ))}
  </div>
);

/**
 * Pinned scroll: the page keeps scrolling vertically as normal, but while this
 * block is on screen it "sticks" in place and the vertical scroll distance is
 * converted into sideways movement of the cards.
 *
 *  wrapper (tall: gives us the scroll distance)
 *   └─ sticky stage (fills the screen under the header, stays pinned)
 *       └─ track (wide row of tall cards, moved with translateX)
 *
 * Progress is calculated from the page scroll position and the wrapper's
 * position in the page, NOT from the viewport height. Mobile browsers resize
 * the viewport when their toolbars show/hide, which made the first version jump.
 *
 * Note: no ancestor of this component may use overflow-hidden/auto, or
 * position: sticky stops working (overflow-clip is fine).
 */
const PinnedScroller = ({ items }: { items: ReactNode[] }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0); // px the track must slide sideways

  const { scrollY } = useScroll();
  const pinStart = useMotionValue(0); // scrollY at which the stage becomes pinned
  const travelMV = useMotionValue(0); // same travel, readable inside transforms

  useLayoutEffect(() => {
    const measure = () => {
      const wrapper = wrapperRef.current;
      const track = trackRef.current;
      const stage = track?.parentElement;
      if (!wrapper || !track || !stage) return;

      const distance = Math.max(0, track.scrollWidth - stage.clientWidth);
      const stickyTop = parseFloat(getComputedStyle(stage).top) || 0;

      pinStart.set(
        wrapper.getBoundingClientRect().top + window.scrollY - stickyTop,
      );
      travelMV.set(distance);
      setTravel(distance);
    };

    measure();
    // Watching the document (not the window) means we re-measure when content
    // above us changes height, but NOT when a phone toolbar collapses.
    const observer = new ResizeObserver(measure);
    observer.observe(document.documentElement);
    return () => observer.disconnect();
  }, [pinStart, travelMV, items.length]);

  // 0 → 1 across the pinned scroll distance (longer than the sideways travel,
  // which is what slows the cards down)
  const rawProgress = useTransform(
    [scrollY, pinStart, travelMV],
    ([y, start, dist]: number[]) =>
      dist > 0 ? clamp((y - start) / (dist * SCROLL_PER_PX), 0, 1) : 0,
  );
  // Spring = the gentle easing: cards glide to the target instead of snapping
  const progress = useSpring(rawProgress, SPRING);
  const x = useTransform(
    [progress, travelMV],
    ([p, dist]: number[]) => -p * dist,
  );

  return (
    <div
      ref={wrapperRef}
      className="-mx-4"
      // scroll distance = sideways travel x SCROLL_PER_PX
      style={{
        height: `calc(${PINNED_STAGE_HEIGHT} + ${travel * SCROLL_PER_PX}px)`,
      }}
    >
      <div
        className="sticky top-24 flex flex-col gap-4 overflow-hidden"
        style={{ height: PINNED_STAGE_HEIGHT }}
      >
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex min-h-0 w-max flex-1 gap-4 px-4 will-change-transform"
        >
          {items.map((item, i) => (
            <div key={i} className={ITEM_WIDTH}>
              {item}
            </div>
          ))}
        </motion.div>

        {/* Progress bar so people can tell the section is moving sideways */}
        <div className="mx-4 h-1 shrink-0 overflow-hidden rounded-full bg-primary/15">
          <motion.div
            style={{ scaleX: progress }}
            className="h-full origin-left rounded-full bg-primary"
          />
        </div>
      </div>
    </div>
  );
};

const PinnedHorizontalScroll = ({
  children,
  fallbackItemClassName,
}: PinnedHorizontalScrollProps) => {
  const reduceMotion = useReducedMotion();
  const items = Children.toArray(children);

  return reduceMotion ? (
    <SnapCarousel items={items} itemClassName={fallbackItemClassName} />
  ) : (
    <PinnedScroller items={items} />
  );
};

export default PinnedHorizontalScroll;
