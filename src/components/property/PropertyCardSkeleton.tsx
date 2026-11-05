import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PropertyCardSkeletonProps {
  className?: string;
}

/**
 * Loading placeholder with the same size and shape as <PropertyCard />,
 * so the layout doesn't jump when real data arrives.
 */
const PropertyCardSkeleton = ({ className }: PropertyCardSkeletonProps) => (
  <Card
    aria-hidden="true"
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
