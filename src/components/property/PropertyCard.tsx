import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { formatPrice } from "@/utils/priceHelpers";
import type { Property } from "@/types";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const imageUrl = property.featuredPhoto?.url || property.photos?.[0]?.url;
  const fullImageUrl = imageUrl
    ? imageUrl.startsWith("http")
      ? imageUrl
      : `${import.meta.env.VITE_STRAPI_URL || ""}${imageUrl}`
    : "https://via.placeholder.com/400x300?text=No+Image";

  return (
    <Link
      to={`/properties/${property.documentId}`}
      className="block h-full outline-none focus:ring-2 focus:ring-primary rounded-2xl"
    >
      <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer group h-[380px] sm:h-[420px] border-0 rounded-2xl">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={fullImageUrl}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
        </div>

        {/* Content (Bottom blurred section) */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="backdrop-blur-md bg-white/10 p-3 sm:p-4 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
            <div className="flex flex-col gap-1 mb-2">
              <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1 drop-shadow-md">
                {property.title}
              </h3>
              <div className="flex items-center text-white/95">
                <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 flex-shrink-0" />
                <span className="text-[11px] sm:text-xs font-medium truncate drop-shadow-md">
                  {property.location}
                </span>
              </div>
            </div>

            <div className="flex items-end justify-between mt-1 pt-2 sm:pt-2.5 border-t border-white/20">
              <div className="flex flex-col">
                <span className="text-white/80 text-[10px] font-semibold uppercase tracking-wider mb-0.5">
                  Prices from
                </span>
                <div className="flex items-baseline text-white drop-shadow-md">
                  <span className="text-sm sm:text-base font-bold">
                    {formatPrice(property.pricePerNight)}
                  </span>
                  <span className="text-[10px] sm:text-xs ml-1 opacity-90 font-medium">
                    / night
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-white/40 text-white hover:bg-white hover:text-black transition-colors rounded-full px-4 text-[11px] sm:text-xs font-semibold h-7 sm:h-8"
              >
                View
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default PropertyCard;
