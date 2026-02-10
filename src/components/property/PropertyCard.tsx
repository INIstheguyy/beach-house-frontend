import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Bed, Bath, Heart, Star } from 'lucide-react';
import { formatPrice } from '@/utils/priceHelpers';
import type { Property } from '@/types';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const imageUrl = property.featuredPhoto?.url ||
                  property.photos?.[0]?.url;
  const fullImageUrl = imageUrl 
    ? `${import.meta.env.VITE_STRAPI_URL}${imageUrl}`
    : 'https://via.placeholder.com/400x300?text=No+Image';

  // Random rating for demonstration (you can replace with actual rating from data)
  const rating = (4.5 + Math.random() * 0.5).toFixed(1);
  const reviewCount = Math.floor(50 + Math.random() * 100);

  return (
    <Link to={`/properties/${property.documentId}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group h-full border-0 shadow-md">
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={fullImageUrl}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {Math.random() > 0.7 && (
              <Badge variant="superhost" className="text-xs">
                SUPERHOST
              </Badge>
            )}
            {Math.random() > 0.8 && (
              <Badge variant="rare-find" className="text-xs">
                RARE FIND
              </Badge>
            )}
          </div>
          
          {/* Favorite Icon */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <CardContent className="p-5">
          {/* Location and Rating */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="text-sm font-medium truncate">{property.location}</span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">{rating}</span>
              <span className="text-xs text-gray-500">({reviewCount})</span>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-3 text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
            {property.title}
          </h3>

          {/* Property Details */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1 text-gray-500" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1 text-gray-500" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1 text-gray-500" />
              <span>{property.maxGuests}</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div>
              <span className="text-2xl font-bold text-accent-500">
                {formatPrice(property.pricePerNight)}
              </span>
              <span className="text-gray-600 text-sm ml-1">/night</span>
            </div>
            <Button
              size="sm"
              className="bg-accent hover:bg-accent-600 text-white"
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PropertyCard;
