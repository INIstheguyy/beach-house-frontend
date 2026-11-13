/**
 * HorizontalCarousel
 * ------------------
 * Desktop-only drag carousel that mirrors the progressive-width logic of
 * PinnedHorizontalScroll but is driven by pointer-drag instead of page scroll.
 *
 * Layout math (identical to mobile):
 *   baseWidth  = DESKTOP_BASE_RATIO * stageWidth        (inactive card)
 *   activeWidth = 2 × baseWidth                        (active card)
 *   closeness   = 1 - clamp(|index - smooth*(count-1)|, 0, 1)
 *   cardWidth   = baseWidth + closeness * baseWidth     (lerp inactive → active)
 *
 * The smooth motion value (0 → 1) represents which card is active.
 * Drag moves it directly; on release a spring snaps to the nearest integer card.
 */

import {
  useRef,
  useCallback,
  Children,
  isValidElement,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type MotionValue,
  type AnimationPlaybackControls,
} from "framer-motion";
import { PinnedDetailsContext } from "@/components/common/pinnedScroll";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Inactive card width as a fraction of the stage width. Active = 2×. */
const DESKTOP_BASE_RATIO = 0.38;

/** Gap between cards in px (matches Tailwind gap-5). */
const DESKTOP_GAP = 20;

/** Stage height for the desktop carousel. */
const DESKTOP_STAGE_HEIGHT = "min(calc(100svh - 10rem), 48rem)";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

// ---------------------------------------------------------------------------
// ItemSlot — wraps one card, animates its width based on closeness to active
// ---------------------------------------------------------------------------

interface ItemSlotProps {
  index: number;
  count: number;
  smooth: MotionValue<number>;
  baseWidth: MotionValue<number>;
  children: ReactNode;
}

function ItemSlot({ index, count, smooth, baseWidth, children }: ItemSlotProps) {
  // 0 when inactive, 1 when fully active
  const closeness = useTransform(
    [smooth, baseWidth] as MotionValue[],
    ([p, _b]: number[]) => {
      const active = p * (count - 1);
      return 1 - clamp(Math.abs(index - active), 0, 1);
    },
  );

  // card width: baseWidth (inactive) → 2×baseWidth (active)
  const width = useTransform(
    [closeness, baseWidth] as MotionValue[],
    ([c, b]: number[]) => b + c * b,
  );

  return (
    <PinnedDetailsContext.Provider value={closeness as MotionValue<number>}>
      <motion.div
        style={{ width, minWidth: 0, flexShrink: 0 }}
        className="h-full"
      >
        {children}
      </motion.div>
    </PinnedDetailsContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// ProgressDot — one animated dot in the bottom indicator row
// (extracted so hooks are not called inside a loop)
// ---------------------------------------------------------------------------

interface ProgressDotProps {
  index: number;
  count: number;
  smooth: MotionValue<number>;
}

function ProgressDot({ index, count, smooth }: ProgressDotProps) {
  const dotActive = useTransform(smooth, (p) => {
    const active = p * (count - 1);
    return 1 - clamp(Math.abs(index - active), 0, 1);
  });
  const opacity = useTransform(dotActive, [0, 1], [0.35, 1]);
  const scale = useTransform(dotActive, [0, 1], [0.7, 1]);
  return (
    <motion.div
      style={{ opacity, scale }}
      className="h-1.5 w-1.5 rounded-full bg-white"
    />
  );
}

// ---------------------------------------------------------------------------
// DragCarousel — the main carousel component
// ---------------------------------------------------------------------------

interface DragCarouselProps {
  items: ReactNode[];
}

function DragCarousel({ items }: DragCarouselProps) {
  const count = items.length;

  // 0 → 1 represents how far through the deck we are (0 = first card active)
  const smooth = useMotionValue(0);

  // Measured stage width (updated via ResizeObserver equivalent below)
  const stageWidthMV = useMotionValue(0);
  const stageRef = useRef<HTMLDivElement>(null);

  // Keep stageWidthMV in sync with actual width
  const measuredRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const ro = new ResizeObserver(([entry]) => {
      stageWidthMV.set(entry.contentRect.width);
    });
    ro.observe(node);
    // Seed immediately
    stageWidthMV.set(node.getBoundingClientRect().width);
    // Store cleanup via a data attribute trick — just hold the observer alive
    (node as any).__ro = ro;
  }, [stageWidthMV]);

  // Derived: base card width in px
  const baseWidth = useTransform(stageWidthMV, (w) => w * DESKTOP_BASE_RATIO);

  // Total travel distance: how far the row must slide to show each card
  // travel = (count - 1) * (baseWidth + gap)   (each step is one base-slot)
  const travelMV = useTransform(baseWidth, (b) => (count - 1) * (b + DESKTOP_GAP));

  // Translate-x of the row so the active card is centred
  const x = useTransform(
    [smooth, stageWidthMV, baseWidth, travelMV],
    ([p, w, b, dist]: number[]) => w / 2 - b - p * dist,
  );

  // Drag handling
  const isDragging = useRef(false);
  const springAnim = useRef<AnimationPlaybackControls | null>(null);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      e.currentTarget.setPointerCapture(e.pointerId);

      const startX = e.clientX;
      const startSmooth = smooth.get();
      let moved = false;

      if (springAnim.current) {
        springAnim.current.stop();
        springAnim.current = null;
      }
      isDragging.current = true;

      const onMove = (moveEvt: PointerEvent) => {
        const dx = moveEvt.clientX - startX;
        if (Math.abs(dx) > 4) moved = true;

        const dist = travelMV.get();
        if (dist <= 0) return;

        const raw = startSmooth - dx / dist;
        let next: number;
        if (raw < 0) next = raw * 0.15;           // elastic resistance at start
        else if (raw > 1) next = 1 + (raw - 1) * 0.15; // elastic resistance at end
        else next = raw;

        smooth.set(next);
      };

      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);

        // Suppress the click that follows a drag so cards don't navigate
        if (moved) {
          const suppress = (evt: Event) => {
            evt.stopPropagation();
            window.removeEventListener("click", suppress, true);
          };
          window.addEventListener("click", suppress, true);
        }

        // Spring-snap to nearest card
        const clamped = clamp(smooth.get(), 0, 1);
        const targetCard = Math.round(clamped * (count - 1));
        const targetSmooth = count > 1 ? targetCard / (count - 1) : 0;

        springAnim.current = animate(smooth, targetSmooth, {
          type: "spring",
          stiffness: 350,
          damping: 35,
          mass: 0.6,
          onComplete: () => {
            springAnim.current = null;
            isDragging.current = false;
          },
        });
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [smooth, count, travelMV],
  );

  if (count === 0) return null;

  return (
    <div
      ref={(node) => {
        (stageRef as any).current = node;
        measuredRef(node);
      }}
      className="relative overflow-hidden select-none cursor-grab active:cursor-grabbing"
      style={{ height: DESKTOP_STAGE_HEIGHT, touchAction: "pan-y" }}
      onPointerDown={handlePointerDown}
    >
      {/* Card row */}
      <motion.div
        style={{ x, gap: DESKTOP_GAP }}
        className="flex h-full w-max will-change-transform"
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

      {/* Progress dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {items.map((_, i) => (
          <ProgressDot key={i} index={i} count={count} smooth={smooth} />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

interface HorizontalCarouselProps {
  children: ReactNode;
}

/**
 * Desktop horizontal drag carousel.
 * Drop-in replacement for the 3-col grid on lg+ screens.
 * Accepts the same children as the PinnedHorizontalScroll.
 */
const HorizontalCarousel = ({ children }: HorizontalCarouselProps) => {
  const items = Children.toArray(children);
  return <DragCarousel items={items} />;
};

export default HorizontalCarousel;
export { DESKTOP_STAGE_HEIGHT };
