
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { vendors, Vendor } from "@/data/vendors";
import { Search, Filter, Star } from "lucide-react";

const Vendors = () => {
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>(vendors);
  const [cuisineFilter, setCuisineFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [priceFilter, setPriceFilter] = useState<string>("");
  const [dietaryFilter, setDietaryFilter] = useState<string>("");

  // Get unique cuisine types
  const cuisineTypes = [...new Set(vendors.map(vendor => vendor.cuisineType))];
  
  // Get all dietary options (flattened and unique)
  const dietaryOptions = [...new Set(vendors.flatMap(vendor => vendor.dietaryOptions))];

  // Apply filters
  useEffect(() => {
    let results = vendors;
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        vendor =>
          vendor.name.toLowerCase().includes(query) ||
          vendor.description.toLowerCase().includes(query) ||
          vendor.cuisineType.toLowerCase().includes(query)
      );
    }
    
    // Apply cuisine filter
    if (cuisineFilter) {
      results = results.filter(vendor => vendor.cuisineType === cuisineFilter);
    }
    
    // Apply price filter
    if (priceFilter) {
      results = results.filter(vendor => vendor.priceRange === priceFilter);
    }
    
    // Apply dietary filter
    if (dietaryFilter) {
      results = results.filter(vendor => 
        vendor.dietaryOptions.includes(dietaryFilter)
      );
    }
    
    setFilteredVendors(results);
  }, [searchQuery, cuisineFilter, priceFilter, dietaryFilter]);

  const handleReset = () => {
    setCuisineFilter("");
    setPriceFilter("");
    setDietaryFilter("");
    setSearchQuery("");
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Food Trucks</h1>
      
      <div className="bg-gray-50 p-6 rounded-lg mb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Cuisine Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cuisines</SelectItem>
              {cuisineTypes.map(cuisine => (
                <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={priceFilter} onValueChange={setPriceFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="$">$ - Budget</SelectItem>
              <SelectItem value="$$">$$ - Moderate</SelectItem>
              <SelectItem value="$$$">$$$ - Premium</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={dietaryFilter} onValueChange={setDietaryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Dietary Options" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Options</SelectItem>
              {dietaryOptions.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="text-gray-500">
              {filteredVendors.length} {filteredVendors.length === 1 ? "vendor" : "vendors"} found
            </span>
          </div>
          <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
            <Filter size={16} />
            Reset Filters
          </Button>
        </div>
      </div>
      
      {filteredVendors.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium">No vendors found</h2>
          <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
          <Button variant="default" onClick={handleReset} className="mt-4">
            Reset All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <Card key={vendor.id} className="overflow-hidden flex flex-col">
              <div className="h-48 overflow-hidden">
                <img 
                  src={vendor.imageUrl} 
                  alt={vendor.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{vendor.name}</CardTitle>
                    <CardDescription>{vendor.cuisineType} • {vendor.priceRange}</CardDescription>
                  </div>
                  <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                    <Star className="h-4 w-4 fill-yellow-500 stroke-yellow-500 mr-1" />
                    {vendor.rating}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1">
                <p className="text-gray-600 mb-4 line-clamp-3">{vendor.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {vendor.dietaryOptions.slice(0, 3).map((option, i) => (
                    <span key={i} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                      {option}
                    </span>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="border-t pt-4 flex justify-between">
                <Button variant="outline" asChild>
                  <Link to={`/vendors/${vendor.id}`}>View Details</Link>
                </Button>
                <Button asChild className="bg-brand-pink hover:bg-pink-700">
                  <Link to={`/book?vendor=${vendor.id}`}>Book Now</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Vendors;
