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
    image: "https://images.pexels.com/photos/32656347/pexels-photo-32656347.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    count: "28 Properties",
  },
  {
    id: 3,
    name: "Victoria Island",
    description: "Premium high-rise living near business districts",
    image: "https://images.unsplash.com/photo-1618828665011-0abd973f7bb8?crop=entropy&cs=srgb&fm=jpg&q=85&w=1260&h=750",
    count: "15 Properties",
  },
  {
    id: 4,
    name: "Eko Atlantic",
    description: "The new coastal city of Lagos with world-class amenities",
    image: "https://images.pexels.com/photos/27857468/pexels-photo-27857468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    count: "8 Properties",
  },
];

const PopularDestinations = () => {
  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
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

        {/* Mobile Layout: Horizontal Scroll with "Sticky" feel */}
        {/* We use a horizontal scroll snap container for mobile */}
        <div className="md:hidden -mx-4 px-4 overflow-x-auto pb-8 snap-x snap-mandatory flex gap-4 scrollbar-hide">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              className="snap-center shrink-0 w-[85vw] relative rounded-[1.5rem] overflow-hidden aspect-[4/3] shadow-md"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${dest.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 w-full text-white">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold mb-3 border border-white/20">
                  {dest.count}
                </span>
                <h3 className="text-2xl font-bold mb-1">{dest.name}</h3>
                <p className="text-sm text-white/80 line-clamp-2">
                  {dest.description}
                </p>
              </div>
            </div>
          ))}
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
