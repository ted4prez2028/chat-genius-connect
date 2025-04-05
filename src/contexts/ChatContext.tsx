
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { useNavigation } from "./NavigationContext";
import { aiPhrases, getInitialGreeting } from "@/data/aiResponses";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
};

type ChatContextType = {
  messages: Message[];
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  isLoading: boolean;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get navigation context safely
  let pageName = "Unknown";
  let currentPage = "/";
  
  try {
    const navigation = useNavigation();
    pageName = navigation.pageName;
    currentPage = navigation.currentPage;
  } catch (error) {
    console.warn("NavigationContext not available, using default values");
  }
  
  // Load messages from localStorage on initial render
  useEffect(() => {
    const savedMessages = localStorage.getItem("foodtruck_chat_messages");
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error("Failed to parse saved messages:", e);
        localStorage.removeItem("foodtruck_chat_messages");
      }
    }
  }, []);
  
  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("foodtruck_chat_messages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      
      // Add user message
      const userMessage: Message = {
        role: "user",
        content,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // In a real app, this would make an API call to ChatGPT
      // For demo purposes, use enhanced responses with knowledge of the website
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let botResponse: string;
      const contentLower = content.toLowerCase();
      
      // Enhanced response logic with detailed knowledge about the food truck platform
      // and awareness of the current page
      if (contentLower.includes("hello") || contentLower.includes("hi")) {
        botResponse = `Hello! I'm Olivia, your Food Truck Community specialist. I notice you're on our ${pageName} page. How can I assist you today?`;
      } else if (contentLower.includes("where am i") || contentLower.includes("which page")) {
        botResponse = `You are currently on our ${pageName} page. Is there anything specific about ${pageName} that you'd like to know?`;
      } else if (contentLower.includes("book") || contentLower.includes("reservation")) {
        if (currentPage === "/book") {
          botResponse = "You're already on our booking page! You can select a food truck, choose your date and time, and fill out your contact details to make a reservation.";
        } else {
          botResponse = "To book a food truck, you can click 'Book a Truck' on our navigation or go directly to the booking page. There you can select vendors, dates, and complete your reservation.";
        }
      } else if (contentLower.includes("vendor") || contentLower.includes("trucks available")) {
        if (currentPage === "/vendors") {
          botResponse = "You're currently browsing our vendors page! Here you can see all of our available food trucks, filter by cuisine type, and read reviews from other customers.";
        } else {
          botResponse = "We have over 50 food trucks available on our platform across various cuisines. You can view all vendors on our Vendors page, where you can filter by cuisine type and availability.";
        }
      } else if (contentLower.includes("order") || contentLower.includes("my booking")) {
        if (currentPage === "/orders") {
          botResponse = "You're on the Orders page now where you can see all your past and upcoming food truck bookings. You can manage, modify or cancel your reservations from here.";
        } else {
          botResponse = "You can view all your orders and bookings on the Orders page. There you'll find your booking history, upcoming reservations, and options to modify your bookings.";
        }
      } else if (contentLower.includes("payment") || contentLower.includes("bill") || contentLower.includes("invoice")) {
        if (currentPage === "/payments") {
          botResponse = "You're currently on our Payments & Billing page where you can manage payment methods, view past invoices, and handle any billing-related tasks.";
        } else {
          botResponse = "Our Payments & Billing page allows you to manage your payment methods, view your transaction history, and download invoices for your food truck bookings.";
        }
      } else if (contentLower.includes("dashboard")) {
        if (currentPage.startsWith("/dashboard")) {
          botResponse = `You're currently on our ${pageName}. Here you can ${
            currentPage === "/dashboard" ? "view your summary metrics, booking trends, and sales data." : 
            currentPage.includes("chat") ? "manage customer support conversations and use AI assistance." :
            currentPage.includes("calendar") ? "view your bookings in calendar format and schedule new events." :
            currentPage.includes("brands") ? "manage your brand profiles and customization options." :
            currentPage.includes("settings") ? "configure your account and platform preferences." :
            currentPage.includes("logs") ? "review system events and activity logs." :
            currentPage.includes("profile") ? "update your personal information and preferences." :
            currentPage.includes("accounts") ? "manage user accounts and permissions." :
            "access specialized dashboard features."
          }`;
        } else {
          botResponse = "Our dashboard gives you a complete overview of your food truck business. You can access it by logging in and clicking on 'View Admin Console' in the navigation.";
        }
      } else {
        // Generate a page-specific response based on current location
        if (currentPage === "/") {
          botResponse = "Welcome to the Food Truck Community homepage! Here you can explore our services, featured vendors, and easily book a food truck for your next event.";
        } else if (currentPage === "/vendors") {
          botResponse = "Our vendors page showcases all the amazing food trucks available on our platform. You can filter by cuisine, check availability, and read customer reviews.";
        } else if (currentPage === "/book") {
          botResponse = "You're on our booking page where you can reserve a food truck for your event. Just select your preferred vendor, date, time, and complete your information to finish the booking.";
        } else if (currentPage === "/orders") {
          botResponse = "The orders page displays all your bookings, both past and upcoming. You can track order status, make modifications, or contact vendors directly from here.";
        } else if (currentPage === "/payments") {
          botResponse = "On the payments page, you can manage your payment methods, view transaction history, and access invoices for all your food truck bookings.";
        } else if (currentPage.startsWith("/dashboard")) {
          botResponse = `The dashboard helps you manage your food truck business efficiently. The ${pageName} section provides specialized tools for ${
            currentPage.includes("chat") ? "customer support" :
            currentPage.includes("calendar") ? "scheduling" :
            currentPage.includes("brands") ? "brand management" :
            currentPage.includes("settings") ? "platform configuration" :
            currentPage.includes("logs") ? "activity tracking" :
            currentPage.includes("profile") ? "personal settings" :
            currentPage.includes("accounts") ? "user management" :
            "business analytics"
          }.`;
        } else {
          botResponse = "Thank you for your message! As your Food Truck Community specialist, I can help with bookings, vendor information, dashboard features, and any other food truck related questions. How else can I assist you today?";
        }
      }
      
      const assistantMessage: Message = {
        role: "assistant",
        content: botResponse,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem("foodtruck_chat_messages");
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        sendMessage,
        clearMessages,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
