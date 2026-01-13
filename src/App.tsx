import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { propertyService } from './services/propertyService';
import type  { Property } from './types';

function App() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await propertyService.getAll();
      console.log('Fetched properties:', data);
      setProperties(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load properties:', err);
      setError('Failed to load properties. Make sure Strapi is running on http://localhost:1337');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-primary">
          Lagos Beach Rentals
        </h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Properties from Strapi</CardTitle>
            <CardDescription>
              Testing API connection
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && <p>Loading properties...</p>}
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                {error}
              </div>
            )}
            
            {!loading && !error && properties.length === 0 && (
              <p className="text-gray-500">No properties found. Add some in Strapi!</p>
            )}
            
            {!loading && !error && properties.length > 0 && (
              <div className="space-y-4">
                <p className="text-green-600 font-semibold">
                  ✅ Connected! Found {properties.length} property(ies)
                </p>
                {properties.map((property) => (
                  <div key={property.id} className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-lg">
                      {property.title}
                    </h3>
                    <p className="text-gray-600">
                      {property.location}
                    </p>
                    <p className="text-primary font-semibold mt-2">
                      ₦{property.pricePerNight.toLocaleString()}/night
                    </p>
                  </div>
                ))}
              </div>
            )}
            
            <Button onClick={loadProperties} className="mt-4">
              Reload Properties
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;