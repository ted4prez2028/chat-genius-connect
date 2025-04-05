
export interface Vendor {
  id: string;
  name: string;
  description: string;
  cuisineType: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  imageUrl: string;
  availableForBooking: boolean;
  popularItems: string[];
  dietaryOptions: string[];
  location: string;
  contactEmail: string;
  contactPhone: string;
}

export const vendors: Vendor[] = [
  {
    id: "v1",
    name: "Urban Taco",
    description: "Authentic Mexican street tacos with a modern twist. Our fresh ingredients and house-made salsas bring the vibrant flavors of Mexico City to your event.",
    cuisineType: "Mexican",
    rating: 4.8,
    reviewCount: 124,
    priceRange: "$$",
    imageUrl: "/lovable-uploads/11f9528a-dda2-46b9-b183-933ed8329d8f.png",
    availableForBooking: true,
    popularItems: ["Carne Asada Tacos", "Baja Fish Tacos", "Elote (Mexican Street Corn)"],
    dietaryOptions: ["Vegetarian", "Gluten-Free Options"],
    location: "Los Angeles, CA",
    contactEmail: "info@urbantaco.com",
    contactPhone: "(555) 123-4567"
  },
  {
    id: "v2",
    name: "Smokin' BBQ",
    description: "Award-winning BBQ featuring slow-smoked meats and house-made sauces. Perfect for large events and gatherings where you want to impress your guests.",
    cuisineType: "BBQ",
    rating: 4.9,
    reviewCount: 207,
    priceRange: "$$$",
    imageUrl: "/lovable-uploads/4759f1b4-060c-4679-baa9-0867042b6629.png",
    availableForBooking: true,
    popularItems: ["Brisket Plate", "Pulled Pork Sandwich", "Smoked Chicken Wings"],
    dietaryOptions: ["Keto-Friendly", "Dairy-Free Options"],
    location: "Austin, TX",
    contactEmail: "bookings@smokinbbq.com",
    contactPhone: "(555) 987-6543"
  },
  {
    id: "v3",
    name: "Pasta Express",
    description: "Fresh, made-to-order pasta dishes with authentic Italian flavors. Our mobile kitchen brings the taste of Italy to your doorstep.",
    cuisineType: "Italian",
    rating: 4.6,
    reviewCount: 98,
    priceRange: "$$",
    imageUrl: "/lovable-uploads/1ca80f99-d4fa-47bf-be5e-0d0fa265612d.png",
    availableForBooking: true,
    popularItems: ["Fettuccine Alfredo", "Spaghetti Carbonara", "Penne Arrabbiata"],
    dietaryOptions: ["Vegetarian", "Vegan Options", "Gluten-Free Pasta Available"],
    location: "Chicago, IL",
    contactEmail: "orders@pastaexpress.com",
    contactPhone: "(555) 456-7890"
  },
  {
    id: "v4",
    name: "Sushi Roll",
    description: "Premium sushi and Japanese cuisine prepared fresh at your event. Our expert chefs create beautiful, delicious rolls that will wow your guests.",
    cuisineType: "Japanese",
    rating: 4.7,
    reviewCount: 156,
    priceRange: "$$$",
    imageUrl: "/lovable-uploads/139603f5-0a62-4b62-8395-35b3581c64df.png",
    availableForBooking: true,
    popularItems: ["California Roll", "Spicy Tuna Roll", "Dragon Roll"],
    dietaryOptions: ["Vegetarian", "Gluten-Free Options", "Pescatarian"],
    location: "Seattle, WA",
    contactEmail: "events@sushiroll.com",
    contactPhone: "(555) 789-0123"
  },
  {
    id: "v5",
    name: "Sweet Tooth",
    description: "Artisanal desserts and sweet treats made with premium ingredients. Perfect for adding a sweet touch to any event.",
    cuisineType: "Desserts",
    rating: 4.9,
    reviewCount: 89,
    priceRange: "$$",
    imageUrl: "/lovable-uploads/8f3a17ee-e82b-44f4-b17a-f8c1924ba4b2.png",
    availableForBooking: true,
    popularItems: ["Gourmet Cupcakes", "French Macarons", "Chocolate Fountain"],
    dietaryOptions: ["Gluten-Free Options", "Vegan Options", "Nut-Free Available"],
    location: "Portland, OR",
    contactEmail: "hello@sweettoothtrucks.com",
    contactPhone: "(555) 234-5678"
  },
  {
    id: "v6",
    name: "Green Machine",
    description: "Healthy, organic bowls, smoothies, and juices. Bringing nutritious, delicious options to health-conscious events.",
    cuisineType: "Healthy",
    rating: 4.5,
    reviewCount: 76,
    priceRange: "$$",
    imageUrl: "/lovable-uploads/fdab0375-3e61-4100-acfd-58213095ef9e.png",
    availableForBooking: true,
    popularItems: ["Acai Bowls", "Green Protein Smoothies", "Buddha Bowls"],
    dietaryOptions: ["Vegan", "Gluten-Free", "Organic", "Paleo"],
    location: "Denver, CO",
    contactEmail: "bookings@greenmachine.com",
    contactPhone: "(555) 345-6789"
  }
];

export const getVendorById = (id: string): Vendor | undefined => {
  return vendors.find(vendor => vendor.id === id);
};

export const getFilteredVendors = (
  cuisineType?: string,
  priceRange?: string,
  dietaryOption?: string
): Vendor[] => {
  return vendors.filter(vendor => {
    const matchesCuisine = !cuisineType || vendor.cuisineType === cuisineType;
    const matchesPriceRange = !priceRange || vendor.priceRange === priceRange;
    const matchesDietaryOption = !dietaryOption || vendor.dietaryOptions.includes(dietaryOption);
    
    return matchesCuisine && matchesPriceRange && matchesDietaryOption;
  });
};
