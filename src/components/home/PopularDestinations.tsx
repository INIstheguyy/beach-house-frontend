import { useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";

const destinations = [
  {
    id: 1,
    name: "Ilashe Private Beach",
    description: "Exclusive luxury beach houses accessible only by boat",
    image:
      "https://images.pexels.com/photos/31362226/pexels-photo-31362226.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    count: "12 Properties",
  },
  {
    id: 2,
    name: "Lekki Phase 1",
    description: "Modern apartments with ocean views in the heart of Lagos",
    image:
      "https://images.pexels.com/photos/32656347/pexels-photo-32656347.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    count: "28 Properties",
  },
  {
    id: 3,
    name: "Victoria Island",
    description: "Premium high-rise living near business districts",
    image:
      "https://images.unsplash.com/photo-1618828665011-0abd973f7bb8?crop=entropy&cs=srgb&fm=jpg&q=85&w=1260&h=750",
    count: "15 Properties",
  },
  {
    id: 4,
    name: "Eko Atlantic",
    description: "The new coastal city of Lagos with world-class amenities",
    image:
      "https://images.pexels.com/photos/27857468/pexels-photo-27857468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    count: "8 Properties",
  },
];

type Destination = (typeof destinations)[number];

// The pinned stage fills the screen under the floating header (top: 6rem)
// with a small margin at the bottom, so the photos use all the open space.
const STAGE_HEIGHT = "calc(100svh - 7.5rem)";

// Tuning knobs for how the section feels:
// - SCROLL_PER_PX: px of vertical scroll needed per px of sideways movement.
//   1 = cards move exactly with your finger, 1.5 = slower, 2 = even slower.
// - SPRING: how the cards "glide" to catch up with your scroll position.
//   Lower stiffness / higher damping = softer and more delayed.
const SCROLL_PER_PX = 1.5;
const SPRING = { stiffness: 90, damping: 28, mass: 0.5, restDelta: 0.0005 };

const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

// One destination card for phones. Shared by the pinned scroller and the
// reduced-motion fallback. Pass a height/aspect class to size it.
const MobileDestinationCard = ({
  dest,
  className,
}: {
  dest: Destination;
  className?: string;
}) => (
  <div
    className={cn(
      "relative w-[85vw] shrink-0 snap-center overflow-hidden rounded-[1.5rem] shadow-md",
      className,
    )}
  >
    <img
      src={dest.image}
      alt={dest.name}
      decoding="async"
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
    <div className="absolute bottom-0 left-0 w-full p-6 text-white">
      {/* No backdrop-blur here: blur re-paints every frame while the card moves */}
      <span className="mb-3 inline-block rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-bold">
        {dest.count}
      </span>
      <h3 className="mb-1 text-2xl font-bold">{dest.name}</h3>
      <p className="line-clamp-2 text-sm text-white/80">{dest.description}</p>
    </div>
  </div>
);

// Fallback for people who prefer reduced motion: a normal swipeable carousel.
const SnapCarousel = () => (
  <div className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-8">
    {destinations.map((dest) => (
      <MobileDestinationCard key={dest.id} dest={dest} className="aspect-[4/3]" />
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
 * the viewport when their toolbars show/hide, which made the old version jump.
 */
const PinnedScroller = () => {
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
  }, [pinStart, travelMV]);

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
      style={{ height: `calc(${STAGE_HEIGHT} + ${travel * SCROLL_PER_PX}px)` }}
    >
      <div
        className="sticky top-24 flex flex-col gap-4 overflow-hidden"
        style={{ height: STAGE_HEIGHT }}
      >
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex min-h-0 w-max flex-1 gap-4 px-4 will-change-transform"
        >
          {destinations.map((dest) => (
            <MobileDestinationCard key={dest.id} dest={dest} />
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

const MobileDestinations = () => {
  const reduceMotion = useReducedMotion();
  return reduceMotion ? <SnapCarousel /> : <PinnedScroller />;
};

const PopularDestinations = () => {
  // Note: the section uses overflow-clip, not overflow-hidden. Hidden would break
  // the sticky (pinned) scroller on mobile; clip hides overflow without that side effect.
  return (
    <section className="py-14 md:py-20 bg-gray-50 overflow-clip">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-6 md:mb-12">
          <div className=" md:flex flex-row justify-between ">
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4 font-heading">
              Popular Vacation Rental Destinations
            </h2>
            <p className="text-gray-600 text-lg max-w-xl">
              Explore the perfect blend of urban retreats and beachside escapes
              in Lagos most exclusive neighborhoods.
            </p>
          </div>
          {/* <Button
            variant="outline"
            className="hidden md:flex border-primary text-primary hover:bg-primary hover:text-white transition-all"
          >
            View all locations <ArrowRight className="ml-2 h-4 w-4" />
          </Button> */}
        </div>

        {/* Desktop Layout: Grid */}
        <div className="hidden md:grid grid-cols-2 gap-6 lg:gap-8">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              className="group relative rounded-[2rem] overflow-hidden aspect-[16/9] cursor-pointer shadow-lg hover:shadow-xl transition-all duration-500"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${dest.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 w-full text-white">
                <div className="flex items-center gap-2 mb-2 text-white/80 text-sm font-medium uppercase tracking-wider">
                  <MapPin className="h-4 w-4" />
                  <span>{dest.count}</span>
                </div>
                <h3 className="text-3xl font-bold mb-2">{dest.name}</h3>
                <p className="text-white/90 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  {dest.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Layout: pinned section, vertical scroll moves the cards sideways */}
        <div className="md:hidden">
          <MobileDestinations />
        </div>

        {/* <div className="md:hidden mt-6 text-center">
          <Button
            variant="outline"
            className="w-full border-primary text-primary"
          >
            View all locations
          </Button>
        </div> */}
      </div>
    </section>
  );
};

export default PopularDestinations;
