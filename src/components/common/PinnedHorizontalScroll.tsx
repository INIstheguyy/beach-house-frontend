import {
  Children,
  isValidElement,
  useEffect,
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
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";
import {
  FOLLOW_FAST_SPEED,
  FOLLOW_GAP_FREE,
  FOLLOW_GAP_FULL,
  FOLLOW_RATE_EXIT,
  FOLLOW_RATE_FAST,
  FOLLOW_RATE_SLOW,
  PINNED_BASE_RATIO,
  PINNED_GAP,
  PINNED_STAGE_HEIGHT,
  PinnedDetailsContext,
  SCROLL_PER_PX,
} from "./pinnedScroll";

const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

// Fallback carousel card width (reduced-motion users)
const FALLBACK_ITEM_WIDTH = "w-[85vw] md:w-[60vw] shrink-0";

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
      <div
        key={isValidElement(item) && item.key != null ? item.key : i}
        className={cn(FALLBACK_ITEM_WIDTH, "snap-center", itemClassName)}
      >
        {item}
      </div>
    ))}
  </div>
);

/**
 * One card's slot in the track. Its width depends on how close it is to the
 * "active" position:
 *
 *   closeness = 1  -> this card is the active one      -> 2x wide
 *   closeness = 0  -> the active card is 1+ cards away -> 1x wide
 *   in between     -> smoothly blended
 *
 * Because one card grows exactly as its neighbour shrinks, the total width of
 * the row never changes, so the scroll distance math stays simple.
 *
 * Everything here is motion values (no React re-renders while scrolling).
 */
const ItemSlot = ({
  index,
  count,
  smooth,
  baseWidth,
  children,
}: {
  index: number;
  count: number;
  smooth: MotionValue<number>;
  baseWidth: MotionValue<number>;
  children: ReactNode;
}) => {
  const closeness = useTransform(smooth, (p) =>
    Math.max(0, 1 - Math.abs(index - p * (count - 1))),
  );
  const width = useTransform(
    [closeness, baseWidth],
    ([c, b]: number[]) => b * (1 + c),
  );
  // Text stays hidden while the card is narrow and fades in as it widens
  const details = useTransform(closeness, [0.4, 1], [0, 1]);
  // Narrow cards can't be tapped by accident while the user is scrolling past
  const pointerEvents = useTransform(closeness, (c) =>
    c > 0.6 ? "auto" : "none",
  );

  return (
    <PinnedDetailsContext.Provider value={details}>
      <motion.div className="h-full shrink-0" style={{ width, pointerEvents }}>
        {children}
      </motion.div>
    </PinnedDetailsContext.Provider>
  );
};

/**
 * Pinned scroll: the page keeps scrolling vertically as normal, but while this
 * block is on screen it "sticks" in place and the vertical scroll distance is
 * converted into sideways movement of the cards. The active card is double
 * width; as you scroll, the next card grows while the previous one shrinks.
 *
 *  wrapper (tall: gives us the scroll distance)
 *   └─ sticky stage (fills the screen under the header, stays pinned)
 *       └─ track (row of cards, moved with translateX)
 *
 * Progress is calculated from the page scroll position and the wrapper's
 * position in the page, NOT from the viewport height. Mobile browsers resize
 * the viewport when their toolbars show/hide, which made the first version jump.
 *
 * Note: no ancestor of this component may use overflow-hidden/auto, or
 * position: sticky stops working (overflow-clip is fine).
 */
const PinnedScroller = ({ items }: { items: ReactNode[] }) => {
  const count = items.length;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0); // px the track slides sideways in total

  const { scrollY } = useScroll();

  // Measurements, kept as motion values so transforms can read them
  const initialWidth = typeof window === "undefined" ? 0 : window.innerWidth;
  const pinStart = useMotionValue(0); // scrollY at which the stage becomes pinned
  const stageWidth = useMotionValue(initialWidth);
  const baseWidth = useMotionValue(initialWidth * PINNED_BASE_RATIO);
  const travelMV = useMotionValue(0);

  useLayoutEffect(() => {
    const measure = () => {
      const wrapper = wrapperRef.current;
      const stage = stageRef.current;
      if (!wrapper || !stage) return;

      const width = stage.clientWidth;
      const base = width * PINNED_BASE_RATIO;
      // Moving from card to card shifts the track by (base + gap) each time
      const distance = Math.max(0, (count - 1) * (base + PINNED_GAP));
      const stickyTop = parseFloat(getComputedStyle(stage).top) || 0;

      pinStart.set(
        wrapper.getBoundingClientRect().top + window.scrollY - stickyTop,
      );
      stageWidth.set(width);
      baseWidth.set(base);
      travelMV.set(distance);
      setTravel(distance);
    };

    measure();
    // Watching the document (not the window) means we re-measure when content
    // above us changes height, but NOT when a phone toolbar collapses.
    const observer = new ResizeObserver(measure);
    observer.observe(document.documentElement);
    return () => observer.disconnect();
  }, [count, pinStart, stageWidth, baseWidth, travelMV]);

  // Where the scroll position says we should be: 0 → 1 across the pinned zone
  const target = useTransform(
    [scrollY, pinStart, travelMV],
    ([y, start, dist]: number[]) =>
      dist > 0 ? clamp((y - start) / (dist * SCROLL_PER_PX), 0, 1) : 0,
  );

  // Where the cards actually are: they chase `target`. The chase gets tighter
  // the faster you scroll, so a hard fling can't leave the cards "playing
  // catch-up" after you've moved on, while a slow scroll still glides.
  const smooth = useMotionValue(0);
  useEffect(() => {
    let raf = 0;
    let lastFrame = 0;
    let synced = false;

    // Scroll speed in px/s, lightly averaged so one odd event doesn't spike it
    let speed = 0;
    let lastY = scrollY.get();
    let lastYTime = performance.now();

    const onScroll = (y: number) => {
      const now = performance.now();
      const dt = now - lastYTime;
      if (dt > 0) speed = speed * 0.5 + ((Math.abs(y - lastY) / dt) * 1000) * 0.5;
      lastY = y;
      lastYTime = now;
    };

    const tick = (now: number) => {
      // (never negative: a frame timestamp can be slightly older than performance.now())
      const dt = clamp((now - lastFrame) / 1000, 0, 0.05);
      lastFrame = now;
      if (now - lastYTime > 100) speed = 0; // no recent scrolling

      const to = target.get();
      const from = smooth.get();

      // First time we have real measurements: start in sync (no animating in
      // from zero when the page loads or is restored part-way down).
      if (!synced && travelMV.get() > 0) {
        synced = true;
        smooth.set(to);
        raf = 0;
        return;
      }

      // Past the pinned zone, the section is leaving the screen: finish fast
      const y = scrollY.get();
      const start = pinStart.get();
      const outside = y < start || y > start + travelMV.get() * SCROLL_PER_PX;

      // Two reasons to follow tightly: you're scrolling fast, or the cards are
      // far behind. (Speed alone isn't enough: it drops to 0 the moment your
      // finger lifts, while the cards may still have a long way to go.)
      const speedRate =
        FOLLOW_RATE_SLOW +
        (FOLLOW_RATE_FAST - FOLLOW_RATE_SLOW) *
          clamp(speed / FOLLOW_FAST_SPEED, 0, 1);
      const gapPx = Math.abs(to - from) * travelMV.get() * SCROLL_PER_PX;
      const gapRate =
        FOLLOW_RATE_SLOW +
        (FOLLOW_RATE_FAST - FOLLOW_RATE_SLOW) *
          clamp(
            (gapPx - FOLLOW_GAP_FREE) / (FOLLOW_GAP_FULL - FOLLOW_GAP_FREE),
            0,
            1,
          );
      const rate = outside ? FOLLOW_RATE_EXIT : Math.max(speedRate, gapRate);

      // Frame-rate independent "move a fraction of the way there"
      const next = from + (to - from) * (1 - Math.exp(-rate * dt));

      if (Math.abs(to - next) < 0.0005) {
        smooth.set(to);
        raf = 0; // settled: stop the loop until something moves again
        return;
      }
      smooth.set(next);
      raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (raf) return;
      lastFrame = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const offScroll = scrollY.on("change", onScroll);
    const offTarget = target.on("change", wake);
    wake();
    return () => {
      offScroll();
      offTarget();
      cancelAnimationFrame(raf);
    };
  }, [scrollY, target, smooth, pinStart, travelMV]);

  // Slide the row so the active card stays centred on screen.
  // (Centre of the active card moves (base + gap) per card: a straight line.)
  const x = useTransform(
    [smooth, stageWidth, baseWidth, travelMV],
    ([p, w, b, dist]: number[]) => w / 2 - b - p * dist,
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
        ref={stageRef}
        className="sticky top-24 flex flex-col gap-4 overflow-hidden"
        style={{ height: PINNED_STAGE_HEIGHT }}
      >
        <motion.div
          style={{ x, gap: PINNED_GAP }}
          className="flex min-h-0 w-max flex-1 will-change-transform"
        >
          {items.map((item, i) => (
            <ItemSlot
              key={isValidElement(item) && item.key != null ? item.key : i}
              index={i}
              count={count}
              smooth={smooth}
              baseWidth={baseWidth}
            >
              {item}
            </ItemSlot>
          ))}
        </motion.div>

        {/* Progress bar so people can tell the section is moving sideways */}
        <div className="mx-4 h-1 shrink-0 overflow-hidden rounded-full bg-primary/15">
          <motion.div
            style={{ scaleX: smooth }}
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
