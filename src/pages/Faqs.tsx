
import { useState } from "react";
import { 
  MessageSquareQuestion, 
  ChevronDown, 
  ChevronUp,
  Search,
  Tag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const faqs: FaqItem[] = [
  {
    id: 1,
    question: "How do I book a food truck for my event?",
    answer: "Booking a food truck is easy! Simply navigate to our 'Book' page, enter your event details (date, time, location, number of guests), browse available food trucks, and select the one(s) you'd like to book. Follow the checkout process to confirm your booking.",
    category: "Booking"
  },
  {
    id: 2,
    question: "What happens if it rains on the day of my event?",
    answer: "Our food trucks are equipped to operate in various weather conditions. In case of severe weather, you can work directly with the vendor to reschedule or make alternative arrangements. We recommend having a backup plan or covered area available for guests.",
    category: "Events"
  },
  {
    id: 3,
    question: "How much space does a food truck need?",
    answer: "Most food trucks require a flat, level space approximately 20 feet long by 10 feet wide, plus additional space for any lines that may form. Some trucks may also need access to power or water hookups. You'll receive specific requirements after booking.",
    category: "Setup"
  },
  {
    id: 4,
    question: "Can food trucks accommodate dietary restrictions?",
    answer: "Yes, many of our vendors offer menu options for various dietary needs including vegetarian, vegan, gluten-free, and allergen-free choices. You can view each truck's menu and dietary accommodations on their profile page before booking.",
    category: "Food"
  },
  {
    id: 5,
    question: "How far in advance should I book a food truck?",
    answer: "We recommend booking at least 4-6 weeks in advance, especially during peak season (spring through fall). For larger events or popular dates like holidays or weekends, booking 2-3 months ahead is advisable to ensure availability.",
    category: "Booking"
  },
  {
    id: 6,
    question: "What is the minimum booking time for a food truck?",
    answer: "Most vendors require a minimum booking of 2-3 hours, excluding setup and breakdown time. For smaller events, some vendors offer express service options. The exact minimum time requirement varies by vendor and can be viewed on their profile.",
    category: "Booking"
  },
  {
    id: 7,
    question: "How does payment work?",
    answer: "When booking, you'll pay a deposit (typically 20-50% of the total) to secure your date. The remaining balance is usually due 1-2 weeks before your event. Some vendors also offer payment plans for large events. All payments are processed securely through our platform.",
    category: "Payments"
  },
  {
    id: 8,
    question: "Can I sample the food before booking?",
    answer: "Many vendors offer tasting sessions for large events like weddings or corporate functions. You can contact vendors directly through our platform to inquire about sampling opportunities or check if they have a brick-and-mortar location or upcoming public events.",
    category: "Food"
  },
  {
    id: 9,
    question: "How do I become a food truck vendor on your platform?",
    answer: "We're always looking for quality food trucks to join our network! Visit the 'Become a Vendor' page to submit an application. You'll need to provide information about your business, menu, pricing, availability, and relevant health permits and insurance documentation.",
    category: "Vendors"
  },
  {
    id: 10,
    question: "What happens if a food truck cancels on me?",
    answer: "In the rare event of a vendor cancellation, we'll immediately notify you and help find a replacement vendor with similar cuisine and pricing. If no suitable replacement is found, you'll receive a full refund of your deposit and any assistance needed in making alternative arrangements.",
    category: "Booking"
  }
];

const categories = ["All", ...Array.from(new Set(faqs.map(faq => faq.category)))];

const FaqsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            <span className="block text-brand-pink">Frequently Asked</span>
            <span className="block">Questions</span>
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Everything you need to know about booking food trucks for your events
          </p>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input 
            type="text"
            placeholder="Search questions..."
            className="pl-10 pr-4 py-2 border-gray-300 focus:ring-brand-pink focus:border-brand-pink"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className={activeCategory === category ? "bg-brand-pink" : ""}
              onClick={() => setActiveCategory(category)}
            >
              <Tag className="mr-2 h-4 w-4" />
              {category}
            </Button>
          ))}
        </div>

        <div className="space-y-6 bg-white rounded-xl shadow-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-brand-yellow opacity-10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-brand-pink opacity-10 rounded-full"></div>
          
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-10">
              <MessageSquareQuestion className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">No questions found matching your search</p>
              <Button 
                variant="link" 
                className="mt-4 text-brand-pink"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredFaqs.map((faq) => (
                <div key={faq.id} className="py-4">
                  <button
                    className="flex justify-between items-center w-full text-left focus:outline-none"
                    onClick={() => toggleExpand(faq.id)}
                  >
                    <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                    <span className="ml-6 flex-shrink-0">
                      {expandedId === faq.id ? (
                        <ChevronUp className="h-5 w-5 text-brand-pink" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </span>
                  </button>
                  <AnimatePresence>
                    {expandedId === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="mt-2 pr-12">
                          <p className="text-base text-gray-500">{faq.answer}</p>
                          <div className="mt-3">
                            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-brand-pink bg-opacity-10 text-brand-pink">
                              {faq.category}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Still have questions?</h2>
          <p className="mt-2 text-gray-500">If you can't find the answer you're looking for, please contact our support team.</p>
          <Button className="mt-4 bg-brand-pink hover:bg-pink-700">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FaqsPage;
