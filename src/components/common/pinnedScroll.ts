import { createContext, useContext } from "react";
import type { MotionValue } from "framer-motion";

// ---------------------------------------------------------------------------
// Shared settings for the pinned horizontal scroll (see PinnedHorizontalScroll)
// ---------------------------------------------------------------------------

// The pinned stage fills the screen under the floating header (top: 6rem)
// with a small margin at the bottom. On tall screens (tablets) it stops at
// 42rem so the cards don't turn into very tall strips.
export const PINNED_STAGE_HEIGHT = "min(calc(100svh - 7.5rem), 42rem)";

// Width of an INACTIVE card as a fraction of the screen width.
// The ACTIVE card is always double that (0.50 -> 1.00 of the screen — full-bleed).
export const PINNED_BASE_RATIO = 0.50;

// Space between cards in px (matches Tailwind's gap-4).
export const PINNED_GAP = 16;

// How much vertical scroll is needed per px of sideways movement.
// 1 = cards move exactly with your finger, 1.5 = slower, 2 = even slower.
// Lowered from 1.5 → 1.2 to compensate for the longer travel caused by wider base cards.
export const SCROLL_PER_PX = 1.2;

// How quickly the cards catch up with your scroll position, in "per second".
// Higher = tighter. 7 means "close ~99% of the gap in about 0.6s".
// The rate slides between SLOW and FAST depending on how fast you scroll,
// so a slow scroll glides and a hard fling keeps up with no leftover animation.
export const FOLLOW_RATE_SLOW = 7;
export const FOLLOW_RATE_FAST = 45;
// Scroll speed (px/s) at which the follower is fully "fast".
export const FOLLOW_FAST_SPEED = 1800;
// The follower also tightens when the cards are far behind, so a big gap
// always closes quickly even after the scrolling has stopped. Measured in
// px of page scroll: up to FREE it just glides, from FULL up it is fully fast.
export const FOLLOW_GAP_FREE = 40;
export const FOLLOW_GAP_FULL = 240;
// Rate used once you've scrolled past the pinned zone: finish almost instantly.
export const FOLLOW_RATE_EXIT = 60;

// ---------------------------------------------------------------------------
// Details fade
// ---------------------------------------------------------------------------

// Each slot in the scroller provides a 0 -> 1 value: 0 for a narrow (inactive)
// card, 1 once the card is fully expanded. Cards use it to fade their text in.
// Outside the scroller the value is null and cards show everything.
export const PinnedDetailsContext = createContext<MotionValue<number> | null>(
  null,
);

export const usePinnedDetailsOpacity = () => useContext(PinnedDetailsContext);
