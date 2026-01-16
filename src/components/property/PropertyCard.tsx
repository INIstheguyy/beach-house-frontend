import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Bed, Bath } from 'lucide-react';
import { formatPrice } from '@/utils/priceHelpers';
import type { Property } from '@/types';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const imageUrl = property.featuredPhoto?.url ||
                  property.photos?.[0]?.url;
  const fullImageUrl = imageUrl 
    ? `${import.meta.env.VITE_STRAPI_URL}${imageUrl}`
    : 'https://via.placeholder.com/400x300?text=No+Image';

  return (
    <Link to={`/properties/${property.documentId}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group h-full">
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={fullImageUrl}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold">
              {property.propertyType}
            </span>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
            {property.title}
          </h3>
          
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="text-sm truncate">{property.location}</span>
          </div>

          {/* Property Details */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span>{property.bedrooms} beds</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{property.bathrooms} baths</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>Max {property.maxGuests}</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(property.pricePerNight)}
              </span>
              <span className="text-gray-600 text-sm ml-1">/night</span>
            </div>
            <Button size="sm" variant="outline" className="group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-colors">
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PropertyCard;