import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import type { PropertyFilters } from "@/types";

interface FilterHeroProps {
  filters: PropertyFilters;
  onFilterChange: (key: keyof PropertyFilters, value: any) => void;
  onSearch?: () => void;
}

const FilterHero = ({ filters, onFilterChange, onSearch }: FilterHeroProps) => {
  const [expandedMobile, setExpandedMobile] = useState(false);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Full-width Background Image with rounded bottom edges */}
      <div className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center rounded-b-[1.5rem] "
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/31362226/pexels-photo-31362226.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
          }}
        >
          <div className="absolute inset-0  rounded-b-[3rem]" />
        </div>

        {/* Desktop/Tablet Content */}
        <div className="relative z-10 pt-12 pb-32 md:pb-40 hidden md:block">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
              Properties
            </h1>
          </div>
        </div>

        {/* Mobile Content - Taller image */}
        <div className="relative z-10 pt-14 pb-32 md:hidden">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-white pt-6">Properties</h1>
          </div>
        </div>
      </div>

      {/* Filter Card positioned at baseline - Desktop/Tablet */}
      <div className="hidden md:block relative -mt-20 z-20">
        <div className="w-full px-4">
          <Card className="w-full bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-6">
                {/* Left side - Filter inputs in a row */}
                <div className="flex-1 grid grid-cols-4 gap-4">
                  {/* Looking for */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Looking for
                    </label>
                    <Input
                      placeholder="Enter Type"
                      className="w-full bg-gray-50"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Price
                    </label>
                    <Select
                      value={filters.maxPrice?.toString() || ""}
                      onValueChange={(value) =>
                        onFilterChange(
                          "maxPrice",
                          value ? Number(value) : undefined,
                        )
                      }
                    >
                      <SelectTrigger className="bg-gray-50">
                        <SelectValue placeholder="Price" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Price</SelectItem>
                        <SelectItem value="30000">₦30,000</SelectItem>
                        <SelectItem value="50000">₦50,000</SelectItem>
                        <SelectItem value="75000">₦75,000</SelectItem>
                        <SelectItem value="100000">₦100,000</SelectItem>
                        <SelectItem value="150000">₦150,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Location
                    </label>
                    <Input
                      placeholder="Location"
                      className="w-full bg-gray-50"
                    />
                  </div>

                  {/* Number of Rooms */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Number of Rooms
                    </label>
                    <Select
                      value={filters.minBedrooms?.toString() || ""}
                      onValueChange={(value) =>
                        onFilterChange(
                          "minBedrooms",
                          value ? Number(value) : undefined,
                        )
                      }
                    >
                      <SelectTrigger className="bg-gray-50">
                        <SelectValue placeholder="2 Bed Rooms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any</SelectItem>
                        <SelectItem value="1">1+ Bedroom</SelectItem>
                        <SelectItem value="2">2+ Bedrooms</SelectItem>
                        <SelectItem value="3">3+ Bedrooms</SelectItem>
                        <SelectItem value="4">4+ Bedrooms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Right side - Search Button */}
                <div className="flex-shrink-0">
                  <Button
                    className="bg-accent hover:bg-accent-600 text-white px-8 h-11 whitespace-nowrap"
                    onClick={onSearch}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search Properties
                  </Button>
                </div>
              </div>

              {/* Filter tags row */}
              <div className="mt-4 pt-4 border-t flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">
                  Filter:
                </span>
                <Tabs
                  value={filters.propertyType || "all"}
                  onValueChange={(value) =>
                    onFilterChange(
                      "propertyType",
                      value === "all" ? undefined : value,
                    )
                  }
                >
                  <TabsList className="bg-transparent gap-2 p-0 h-auto">
                    <TabsTrigger
                      value="all"
                      className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700 hover:bg-gray-200 rounded-full px-5 py-1.5 text-sm font-medium transition-all"
                    >
                      City
                    </TabsTrigger>
                    <TabsTrigger
                      value="Beach House"
                      className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700 hover:bg-gray-200 rounded-full px-5 py-1.5 text-sm font-medium transition-all"
                    >
                      House
                    </TabsTrigger>
                    <TabsTrigger
                      value="Apartment"
                      className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700 hover:bg-gray-200 rounded-full px-5 py-1.5 text-sm font-medium transition-all"
                    >
                      Apartment
                    </TabsTrigger>
                    <TabsTrigger
                      value="Villa"
                      className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700 hover:bg-gray-200 rounded-full px-5 py-1.5 text-sm font-medium transition-all"
                    >
                      Residential
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile Filter Card - Collapsible */}
      <div className="md:hidden relative -mt-16 z-20 px-4">
        <Card className="w-full bg-white/95 backdrop-blur-sm border-0  rounded-2xl overflow-hidden">
          <CardContent className="p-4">
            {/* Property Type Tabs - Always visible */}
            <div className="mb-3">
              <Tabs
                value={filters.propertyType || "all"}
                onValueChange={(value) =>
                  onFilterChange(
                    "propertyType",
                    value === "all" ? undefined : value,
                  )
                }
              >
                <TabsList className="w-full bg-transparent gap-2 p-0 h-auto flex-wrap justify-start">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700 rounded-full px-4 py-2 text-sm font-medium transition-all"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="Beach House"
                    className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700 rounded-full px-4 py-2 text-sm font-medium transition-all"
                  >
                    Beach House
                  </TabsTrigger>
                  <TabsTrigger
                    value="Apartment"
                    className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700 rounded-full px-4 py-2 text-sm font-medium transition-all"
                  >
                    Apartment
                  </TabsTrigger>
                  {/* <TabsTrigger
                    value="Villa"
                    className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700 rounded-full px-4 py-2 text-sm font-medium transition-all"
                  >
                    Villa
                  </TabsTrigger> */}
                </TabsList>
              </Tabs>
            </div>

            {/* Toggle More Filters Button */}
            <button
              onClick={() => setExpandedMobile(!expandedMobile)}
              className="w-full flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <span>More </span>
              {expandedMobile ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {/* Expandable Filter Options - Drawer effect */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                expandedMobile ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"
              }`}
            >
              <div className="space-y-3 pt-3 border-t">
                {/* Price */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Max Price
                  </label>
                  <Select
                    value={filters.maxPrice?.toString() || ""}
                    onValueChange={(value) =>
                      onFilterChange(
                        "maxPrice",
                        value ? Number(value) : undefined,
                      )
                    }
                  >
                    <SelectTrigger className="bg-gray-50">
                      <SelectValue placeholder="Any Price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Price</SelectItem>
                      <SelectItem value="30000">₦30,000</SelectItem>
                      <SelectItem value="50000">₦50,000</SelectItem>
                      <SelectItem value="75000">₦75,000</SelectItem>
                      <SelectItem value="100000">₦100,000</SelectItem>
                      <SelectItem value="150000">₦150,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Bedrooms
                  </label>
                  <Select
                    value={filters.minBedrooms?.toString() || ""}
                    onValueChange={(value) =>
                      onFilterChange(
                        "minBedrooms",
                        value ? Number(value) : undefined,
                      )
                    }
                  >
                    <SelectTrigger className="bg-gray-50">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any</SelectItem>
                      <SelectItem value="1">1+ Bedroom</SelectItem>
                      <SelectItem value="2">2+ Bedrooms</SelectItem>
                      <SelectItem value="3">3+ Bedrooms</SelectItem>
                      <SelectItem value="4">4+ Bedrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Location
                  </label>
                  <Input
                    placeholder="Enter location"
                    className="w-full bg-gray-50"
                  />
                </div>

                {/* Search Button */}
                <Button
                  className="w-full bg-accent hover:bg-accent-600 text-white"
                  onClick={onSearch}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search Properties
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FilterHero;
