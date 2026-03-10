import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import {
  Wifi,
  Waves,
  UtensilsCrossed,
  Wind,
  Tv,
  Car,
  WashingMachine,
  Dog,
} from "lucide-react";

// Amenity data matching the design
const AMENITIES = [
  {
    id: "pet",
    icon: Dog,
    label: "Pet-friendly",
    color: "text-gray-800",
    bgColor: "bg-pink-100/50",
  },
  {
    id: "pool",
    icon: Waves,
    label: "Pool",
    color: "text-blue-600",
    bgColor: "bg-blue-100/50",
  },
  {
    id: "wifi",
    icon: Wifi,
    label: "Wifi",
    color: "text-orange-600",
    bgColor: "bg-orange-100/50",
  },
  {
    id: "kitchen",
    icon: UtensilsCrossed,
    label: "Kitchen",
    color: "text-rose-600",
    bgColor: "bg-rose-100/50",
  },
  {
    id: "ac",
    icon: Wind,
    label: "Air conditioning",
    color: "text-cyan-600",
    bgColor: "bg-cyan-100/50",
  },
  {
    id: "tv",
    icon: Tv,
    label: "TV",
    color: "text-purple-600",
    bgColor: "bg-purple-100/50",
  },
  {
    id: "parking",
    icon: Car,
    label: "Parking",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100/50",
  },
  {
    id: "laundry",
    icon: WashingMachine,
    label: "Washing Machine",
    color: "text-teal-600",
    bgColor: "bg-teal-100/50",
  },
  // Duplicate a few to make it more crowded like the tealy.ai example
  {
    id: "wifi2",
    icon: Wifi,
    label: "Fast Internet",
    color: "text-orange-600",
    bgColor: "bg-orange-100/50",
  },
  {
    id: "pool2",
    icon: Waves,
    label: "Private Pool",
    color: "text-blue-600",
    bgColor: "bg-blue-100/50",
  },
  {
    id: "parking2",
    icon: Car,
    label: "Secure Parking",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100/50",
  },
  {
    id: "ac2",
    icon: Wind,
    label: "Climate Control",
    color: "text-cyan-600",
    bgColor: "bg-cyan-100/50",
  },
];

const AnimatedAmenities = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const bodiesRef = useRef<{ body: Matter.Body; elem: HTMLDivElement }[]>([]);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [isInView, setIsInView] = useState(false);

  // Intersection Observer to trigger when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.3 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView || !containerRef.current) return;

    const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint } =
      Matter;

    const width = containerRef.current.clientWidth;
    const height = 400; // Fixed height for the container

    // Create engine
    const engine = Engine.create();
    engineRef.current = engine;

    // Optional: add a render for debugging
    // const render = Render.create({
    //   element: containerRef.current,
    //   engine: engine,
    //   options: {
    //     width,
    //     height,
    //     wireframes: false,
    //     background: 'transparent'
    //   }
    // });
    // renderRef.current = render;
    // Render.run(render);

    // Create runner
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // Add boundaries (walls and ground)
    const wallOptions = {
      isStatic: true,
      render: { visible: false },
    };

    const ground = Bodies.rectangle(
      width / 2,
      height + 25,
      width,
      50,
      wallOptions,
    );
    const leftWall = Bodies.rectangle(
      -25,
      height / 2,
      50,
      height * 2,
      wallOptions,
    );
    const rightWall = Bodies.rectangle(
      width + 25,
      height / 2,
      50,
      height * 2,
      wallOptions,
    );
    const ceiling = Bodies.rectangle(
      width / 2,
      -500,
      width * 3,
      50,
      wallOptions,
    ); // High ceiling to catch things if needed

    World.add(engine.world, [ground, leftWall, rightWall, ceiling]);

    // Add mouse control
    const mouse = Mouse.create(containerRef.current);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    World.add(engine.world, mouseConstraint);

    // Keep mouse in sync with scrolling
    // mouseConstraint.mouse.element.removeEventListener("mousewheel", mouseConstraint.mouse.mousewheel);
    // mouseConstraint.mouse.element.removeEventListener("DOMMouseScroll", mouseConstraint.mouse.mousewheel);

    // Create amenity bodies
    const amenitiesBodies: Matter.Body[] = [];
    const elementsList: { body: Matter.Body; elem: HTMLDivElement }[] = [];

    AMENITIES.forEach((_, index) => {
      const elem = elementsRef.current[index];
      if (!elem) return;

      const radius = 50; // Approximated radius for circles (100px width/height)

      // Random starting positions inside the container but near the top
      const x = Math.random() * (width - radius * 2) + radius;
      // Stagger vertical drop inside the view instead of high above
      const y = Math.random() * -200 - 50;

      const body = Bodies.circle(x, y, radius, {
        restitution: 0.6, // Bounciness
        friction: 0.1,
        frictionAir: 0.01,
        density: 0.001,
      });

      amenitiesBodies.push(body);
      elementsList.push({ body, elem });
    });

    World.add(engine.world, amenitiesBodies);
    bodiesRef.current = elementsList;

    // Sync DOM elements with physics bodies
    let animationFrameId: number;
    const syncDOM = () => {
      elementsList.forEach(({ body, elem }) => {
        const { x, y } = body.position;
        // The DOM element is 100x100. Translate by x and y but offset by 50 to center it.
        elem.style.transform = `translate(${x - 50}px, ${y - 50}px) rotate(${body.angle}rad)`;
      });
      animationFrameId = requestAnimationFrame(syncDOM);
    };

    syncDOM();

    // Handle React component unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (renderRef.current) {
        Render.stop(renderRef.current);
        renderRef.current.canvas.remove();
      }
      if (runnerRef.current) {
        Runner.stop(runnerRef.current);
      }
      if (engineRef.current) {
        World.clear(engineRef.current.world, false);
        Engine.clear(engineRef.current);
      }
    };
  }, [isInView]);

  // Handle resize to update boundaries
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !engineRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = 400;

      // Update right wall position and ground width
      const engine = engineRef.current;
      const staticBodies = Matter.Composite.allBodies(engine.world).filter(
        (b: Matter.Body) => b.isStatic,
      );

      // We know order: ground, leftWall, rightWall, ceiling
      if (staticBodies.length >= 3) {
        Matter.Body.setPosition(staticBodies[0], {
          x: width / 2,
          y: height + 25,
        });
        // Can't easily resize width of body without vertices recreation, but we can scale it
        // Or simply remove and recreate
        Matter.Composite.remove(engine.world, staticBodies);

        const wallOptions = { isStatic: true, render: { visible: false } };
        const ground = Matter.Bodies.rectangle(
          width / 2,
          height + 25,
          width,
          50,
          wallOptions,
        );
        const leftWall = Matter.Bodies.rectangle(
          -25,
          height / 2,
          50,
          height * 2,
          wallOptions,
        );
        const rightWall = Matter.Bodies.rectangle(
          width + 25,
          height / 2,
          50,
          height * 2,
          wallOptions,
        );
        const ceiling = Matter.Bodies.rectangle(
          width / 2,
          -500,
          width * 3,
          50,
          wallOptions,
        );

        Matter.World.add(engine.world, [ground, leftWall, rightWall, ceiling]);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="py-24 bg-[#FAF7F2] overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6">
           amenities we provide
          </h2>
          <p className="text-gray-600 text-lg">
            The little details make all the difference—explore our top-tier
            amenities.
          </p>
        </div>

        {/* Physics Container */}
        <div
          ref={containerRef}
          className="relative max-w-5xl mx-auto h-[400px] bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden"
          style={{ touchAction: "none" }} // Prevents scrolling when interacting with physics elements on mobile
        >
          {AMENITIES.map((amenity, i) => {
            const Icon = amenity.icon;
            return (
              <div
                key={`${amenity.id}-${i}`}
                ref={(el) => {
                  elementsRef.current[i] = el;
                }}
                className={`absolute left-0 top-0 w-[100px] h-[100px] rounded-full flex flex-col items-center justify-center p-2 cursor-grab active:cursor-grabbing shadow-sm border border-white ${amenity.bgColor} hover:shadow-md transition-shadow`}
                style={{
                  userSelect: "none",
                }}
              >
                <Icon className={`w-8 h-8 mb-1 ${amenity.color}`} />
                <span
                  className={`text-[10px] font-medium text-center leading-tight ${amenity.color} px-1`}
                >
                  {amenity.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AnimatedAmenities;
