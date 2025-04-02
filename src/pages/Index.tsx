
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ChatWidget from "@/components/chat/ChatWidget";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-100 py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-7xl font-bold mb-6">
            <span className="foodtruck-title">THE </span>
            <span className="foodtruck-highlight">PERFECT </span>
            <span className="foodtruck-title">DINING</span><br />
            <span className="foodtruck-title">OPTIONS FOR YOUR EVENT</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-4">
            Connecting communities, one food truck at a time.
          </p>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Experience each and every events with a food truck at your door step.
          </p>
          <Button className="btn-primary text-lg py-6 px-8" asChild>
            <Link to="/book">BOOK A TRUCK</Link>
          </Button>
        </div>
      </section>

      {/* Featured Vendors Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Food Trucks</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img 
                src="/public/lovable-uploads/139603f5-0a62-4b62-8395-35b3581c64df.png" 
                alt="Smash Jibarito" 
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Smash Jibarito</h3>
                <p className="text-gray-600 mb-4">Authentic Puerto Rican cuisine featuring the famous jibarito sandwich with smashed plantains instead of bread.</p>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/vendors/smash-jibarito">View Details</Link>
                </Button>
              </div>
            </div>
            
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img 
                src="/public/lovable-uploads/11f9528a-dda2-46b9-b183-933ed8329d8f.png" 
                alt="Barstool BBQ" 
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Barstool BBQ</h3>
                <p className="text-gray-600 mb-4">Slow-smoked meats and homemade sides that bring authentic Southern BBQ flavors to your event.</p>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/vendors/barstool-bbq">View Details</Link>
                </Button>
              </div>
            </div>
            
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img 
                src="/public/lovable-uploads/c0bc3b3b-a4cc-4801-8764-92e0d2e58413.png" 
                alt="Flash Taco" 
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Flash Taco</h3>
                <p className="text-gray-600 mb-4">Quick, fresh, and flavorful tacos made with locally sourced ingredients and authentic Mexican recipes.</p>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/vendors/flash-taco">View Details</Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Button variant="link" className="text-brand-pink text-lg inline-flex items-center" asChild>
              <Link to="/vendors">
                View All Vendors <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-brand-pink rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">1</div>
              <h3 className="text-xl font-bold mb-2">Browse Food Trucks</h3>
              <p className="text-gray-600">Explore our wide selection of food trucks and find the perfect option for your event.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-brand-pink rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">2</div>
              <h3 className="text-xl font-bold mb-2">Request a Booking</h3>
              <p className="text-gray-600">Select your date, time, and location, then request to book your chosen food truck.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-brand-pink rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">3</div>
              <h3 className="text-xl font-bold mb-2">Enjoy Your Event</h3>
              <p className="text-gray-600">The food truck arrives at your event, ready to serve delicious food to your guests.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-100 p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="bg-brand-yellow rounded-full w-12 h-12 flex items-center justify-center mr-4 text-white font-bold">JD</div>
                <div>
                  <h4 className="font-bold">John Doe</h4>
                  <p className="text-gray-600">Corporate Event Planner</p>
                </div>
              </div>
              <p className="text-gray-700">"Food Truck Community made our company picnic a huge success! The variety of food trucks was impressive, and the booking process was seamless. Highly recommend!"</p>
            </div>
            
            <div className="bg-gray-100 p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="bg-brand-pink rounded-full w-12 h-12 flex items-center justify-center mr-4 text-white font-bold">SM</div>
                <div>
                  <h4 className="font-bold">Sarah Mitchell</h4>
                  <p className="text-gray-600">Wedding Coordinator</p>
                </div>
              </div>
              <p className="text-gray-700">"Our wedding guests loved having food trucks as a unique dining option! The Food Truck Community team helped us select the perfect trucks to match our theme and dietary needs."</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-brand-brown text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Book Your Food Truck?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Whether you're planning a corporate event, wedding, or community gathering, we have the perfect food truck for you.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="btn-primary" asChild>
              <Link to="/book">Book Now</Link>
            </Button>
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-brand-brown" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
};

export default HomePage;
