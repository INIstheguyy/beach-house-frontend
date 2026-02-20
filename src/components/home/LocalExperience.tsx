const LocalExperience = () => {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Text Content - Left Side / Top on Mobile */}
          <div className="lg:col-span-5">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
              <span className="text-primary font-semibold text-sm uppercase tracking-wide">
                Local Experts
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary font-heading leading-tight mb-6">
              We're Locals You Can Trust!
            </h2>
            
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              We live here, we work here, and we know every beach, every hidden gem, 
              and every local favorite in Lagos. Our dedicated team offers personalized 
              concierge services, insider recommendations, and 24/7 support to make your 
              Lagos beach getaway truly unforgettable. From airport pickups to restaurant 
              reservations and discovering authentic local experiences, we handle every 
              detail so you can focus on creating memories.
            </p>
          </div>

          {/* Angled Images - Right Side / Below Text on Mobile */}
          <div className="lg:col-span-7">
            {/* Mobile: Stacked Layout */}
            <div className="grid grid-cols-1 gap-6 lg:hidden">
              {/* Image 1 - Mobile */}
              <div className="transform rotate-[2deg] transition-transform duration-500 hover:rotate-0">
                <svg
                  viewBox="0 0 400 300"
                  className="w-full h-auto drop-shadow-lg"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <defs>
                    <clipPath id="mobileClip1">
                      <path d="M 15,5 L 390,0 L 385,295 L 10,300 Z" />
                    </clipPath>
                  </defs>
                  <image
                    href="https://images.pexels.com/photos/30277229/pexels-photo-30277229.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1"
                    width="400"
                    height="300"
                    clipPath="url(#mobileClip1)"
                    preserveAspectRatio="xMidYMid slice"
                  />
                </svg>
              </div>

              {/* Image 2 - Mobile */}
              <div className="transform -rotate-[2deg] transition-transform duration-500 hover:rotate-0">
                <svg
                  viewBox="0 0 400 300"
                  className="w-full h-auto drop-shadow-lg"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <defs>
                    <clipPath id="mobileClip2">
                      <path d="M 10,0 L 385,5 L 390,300 L 15,295 Z" />
                    </clipPath>
                  </defs>
                  <image
                    href="https://images.pexels.com/photos/27857461/pexels-photo-27857461.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1"
                    width="400"
                    height="300"
                    clipPath="url(#mobileClip2)"
                    preserveAspectRatio="xMidYMid slice"
                  />
                </svg>
              </div>
            </div>

            {/* Desktop: Layered/Overlapping Layout */}
            <div className="hidden lg:block relative min-h-[600px]">
              {/* Image 1 - Portrait, Top-Right */}
              <div className="absolute top-0 right-0 w-[45%] transform rotate-[8deg] transition-transform duration-500 hover:rotate-[4deg] hover:scale-105 z-20">
                <svg
                  viewBox="0 0 300 400"
                  className="w-full h-auto drop-shadow-2xl"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <defs>
                    <clipPath id="desktopClip1">
                      <path d="M 15,5 L 290,0 L 285,395 L 10,400 Z" />
                    </clipPath>
                  </defs>
                  <image
                    href="https://images.pexels.com/photos/30277229/pexels-photo-30277229.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&dpr=1"
                    width="300"
                    height="400"
                    clipPath="url(#desktopClip1)"
                    preserveAspectRatio="xMidYMid slice"
                  />
                </svg>
              </div>

              {/* Image 2 - Landscape, Bottom-Left */}
              <div className="absolute bottom-0 left-0 w-[60%] transform -rotate-[6deg] transition-transform duration-500 hover:rotate-[-2deg] hover:scale-105 z-10">
                <svg
                  viewBox="0 0 400 300"
                  className="w-full h-auto drop-shadow-2xl"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <defs>
                    <clipPath id="desktopClip2">
                      <path d="M 20,10 L 395,5 L 380,295 L 5,300 Z" />
                    </clipPath>
                  </defs>
                  <image
                    href="https://images.pexels.com/photos/27857461/pexels-photo-27857461.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1"
                    width="400"
                    height="300"
                    clipPath="url(#desktopClip2)"
                    preserveAspectRatio="xMidYMid slice"
                  />
                </svg>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-secondary/20 rounded-full blur-3xl -z-10" />
              <div className="absolute -top-8 -left-8 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocalExperience;
