import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { PropertyFilters } from "@/types";

interface FilterHeroProps {
  filters: PropertyFilters;
  onFilterChange: (key: keyof PropertyFilters, value: any) => void;
  onClearFilters?: () => void;
}

const FilterHero = ({
  filters,
  onFilterChange,
  onClearFilters,
}: FilterHeroProps) => {
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
        <div className="relative z-10 pt-12 pb-32 md:pb-56 hidden md:block">
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
      <div className="hidden md:block relative -mt-32 z-20">
        <div className="w-full px-4 max-w-5xl mx-auto">
          <Card className="w-full bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-hidden">
            <CardContent className="p-5">
              <div className="flex flex-col gap-6">
                {/* Row 1: Centered Tabs and Clear Button */}
                <div className="flex justify-center items-center">
                  <div className="flex items-center gap-8 border rounded-full px-6 py-2 bg-white/50 shadow-sm">
                    {/* Left side: Tabs */}
                    <div className="flex items-center gap-3">
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
                            className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-700 hover:bg-gray-100 rounded-full px-5 py-1.5 text-sm font-medium transition-all"
                          >
                            All
                          </TabsTrigger>
                          <TabsTrigger
                            value="Beach House"
                            className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-700 hover:bg-gray-100 rounded-full px-5 py-1.5 text-sm font-medium transition-all"
                          >
                            Beach House
                          </TabsTrigger>
                          <TabsTrigger
                            value="Apartment"
                            className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-700 hover:bg-gray-100 rounded-full px-5 py-1.5 text-sm font-medium transition-all"
                          >
                            Apartment
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>

                    {/* Right side: Clear Button */}
                    {onClearFilters && (
                      <div className="border-l pl-8">
                        <Button
                          variant="ghost"
                          onClick={onClearFilters}
                          className="h-8 px-4 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full"
                        >
                          Clear all
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 2: 3-Column Grid */}
                <div className="w-full grid grid-cols-3 gap-6">
                  {/* Location Dropdown */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                      Location
                    </label>
                    <Select
                      value={filters.location || "all"}
                      onValueChange={(value) =>
                        onFilterChange(
                          "location",
                          value === "all" ? undefined : value,
                        )
                      }
                    >
                      <SelectTrigger className="bg-gray-50 h-11 border-0 focus:ring-0 shadow-none">
                        <SelectValue placeholder="Any Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Location</SelectItem>
                        <SelectItem value="lekki">Lekki</SelectItem>
                        <SelectItem value="ilashe">Ilashe</SelectItem>
                        <SelectItem value="ibeshe">Ibeshe</SelectItem>
                        <SelectItem value="vi">VI</SelectItem>
                        <SelectItem value="eko atlantic">
                          Eko Atlantic
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Number of Rooms Range */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                      Minimum Bedrooms: {filters.minBedrooms || 1}
                    </label>
                    <div className="pt-2">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={filters.minBedrooms || 1}
                        onChange={(e) =>
                          onFilterChange("minBedrooms", Number(e.target.value))
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>1</span>
                        <span>10+</span>
                      </div>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                      Max Price (Per Night):{" "}
                      {filters.maxPrice
                        ? `₦${filters.maxPrice.toLocaleString()}`
                        : "₦500,000"}
                    </label>
                    <div className="pt-2">
                      <input
                        type="range"
                        min="10000"
                        max="500000"
                        step="10000"
                        value={filters.maxPrice || 500000}
                        onChange={(e) =>
                          onFilterChange("maxPrice", Number(e.target.value))
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>₦10,000</span>
                        <span>₦500,000+</span>
                      </div>
                    </div>
                  </div>
                </div>
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
                expandedMobile
                  ? "max-h-96 opacity-100 mt-3"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="space-y-4 pt-4 border-t">
                {/* Location Dropdown */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                    Location
                  </label>
                  <Select
                    value={filters.location || "all"}
                    onValueChange={(value) =>
                      onFilterChange(
                        "location",
                        value === "all" ? undefined : value,
                      )
                    }
                  >
                    <SelectTrigger className="bg-gray-50 w-full border-0 focus:ring-0 shadow-none">
                      <SelectValue placeholder="Any Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Location</SelectItem>
                      <SelectItem value="lekki">Lekki</SelectItem>
                      <SelectItem value="ilashe">Ilashe</SelectItem>
                      <SelectItem value="ibeshe">Ibeshe</SelectItem>
                      <SelectItem value="vi">VI</SelectItem>
                      <SelectItem value="eko atlantic">Eko Atlantic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                    Max Price: ₦
                    {filters.maxPrice
                      ? filters.maxPrice.toLocaleString()
                      : "500,000"}
                  </label>
                  <div className="pt-2">
                    <input
                      type="range"
                      min="10000"
                      max="500000"
                      step="10000"
                      value={filters.maxPrice || 500000}
                      onChange={(e) =>
                        onFilterChange("maxPrice", Number(e.target.value))
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>₦10,000</span>
                      <span>₦500,000+</span>
                    </div>
                  </div>
                </div>

                {/* Bedrooms Range */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                    Minimum Bedrooms: {filters.minBedrooms || 1}
                  </label>
                  <div className="pt-2">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={filters.minBedrooms || 1}
                      onChange={(e) =>
                        onFilterChange("minBedrooms", Number(e.target.value))
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>1</span>
                      <span>10+</span>
                    </div>
                  </div>
                </div>

                {/* Clear Button */}
                {onClearFilters && (
                  <Button
                    variant="outline"
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    onClick={() => {
                      onClearFilters();
                      setExpandedMobile(false);
                    }}
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FilterHero;
