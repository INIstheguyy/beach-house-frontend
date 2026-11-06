import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  PINNED_BASE_RATIO,
  PINNED_GAP,
  PINNED_STAGE_HEIGHT,
} from "@/components/common/pinnedScroll";

interface PropertyCardSkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Loading placeholder with the same size and shape as <PropertyCard />,
 * so the layout doesn't jump when real data arrives.
 */
const PropertyCardSkeleton = ({
  className,
  style,
}: PropertyCardSkeletonProps) => (
  <Card
    aria-hidden="true"
    style={style}
    className={cn(
      "relative h-[380px] sm:h-[420px] overflow-hidden rounded-2xl border-0 bg-gray-200 animate-pulse",
      className,
    )}
  >
    <div className="absolute bottom-0 left-0 right-0 space-y-3 bg-gray-300/60 p-4">
      <div className="h-5 w-3/4 rounded bg-gray-300" />
      <div className="h-4 w-1/2 rounded bg-gray-300" />
      <div className="h-4 w-1/3 rounded bg-gray-300" />
    </div>
  </Card>
);

export default PropertyCardSkeleton;

/**
 * Loading row for the mobile/tablet pinned scroller: same height as the stage,
 * first card active (2x wide, centred) and the next one narrow, like the real thing.
 */
export const PinnedPropertySkeletonRow = () => {
  const base = PINNED_BASE_RATIO * 100; // vw
  return (
    <div
      className="lg:hidden -mx-4 flex overflow-hidden"
      style={{
        height: PINNED_STAGE_HEIGHT,
        gap: PINNED_GAP,
        paddingLeft: `${(100 - base * 2) / 2}vw`,
      }}
    >
      {[2, 1].map((size, i) => (
        <PropertyCardSkeleton
          key={i}
          className="h-full shrink-0 sm:h-full"
          // width is set inline so it matches the scroller's math exactly
          style={{ width: `${base * size}vw` }}
        />
      ))}
    </div>
  );
};
