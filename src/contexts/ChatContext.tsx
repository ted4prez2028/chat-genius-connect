
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

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
      if (contentLower.includes("hello") || contentLower.includes("hi")) {
        botResponse = "Hello! I'm Olivia, your Food Truck Community specialist. I can help you book food trucks, explore our vendor options, navigate the dashboard, or answer questions about our services. What can I assist you with today?";
      } else if (contentLower.includes("book") || contentLower.includes("reservation")) {
        botResponse = "To book a food truck, you can use the 'Book a Truck' button on our homepage, or browse our vendors and select the one you'd like to book. Our calendar feature in the dashboard helps you schedule and manage all your bookings in one place. Would you like me to explain the booking process in detail?";
      } else if (contentLower.includes("dashboard")) {
        botResponse = "Your dashboard is your command center for all food truck activities! It shows your summary metrics at the top, popular tags for quick filtering, a daily sales chart to track your bookings over time, package sales data, and a detailed sales report. You can access additional features like the calendar view, brand management, and settings through the sidebar.";
      } else if (contentLower.includes("calendar")) {
        botResponse = "The calendar view provides a visual timeline of all your food truck bookings. You can add new events by clicking on a date, drag-and-drop to reschedule, and color-code by cuisine type or event type. It's great for planning multiple events and ensuring you don't have scheduling conflicts.";
      } else if (contentLower.includes("price") || contentLower.includes("cost") || contentLower.includes("payment")) {
        botResponse = "Our pricing varies by vendor, event size, duration, and selected package. Basic packages start at $500 for a 2-hour event, while premium packages with additional services start at $1,200. You can see detailed pricing on each vendor's page. We accept all major credit cards, digital wallets, and offer installment payment options for larger events.";
      } else if (contentLower.includes("vendor") || contentLower.includes("become")) {
        botResponse = "To become a vendor on our platform, click on 'Become a Vendor' in our navigation and complete the application form. You'll need to provide business license information, food safety certifications, insurance details, and menu options. Our team reviews applications within 48 hours, and once approved, you can start receiving bookings immediately.";
      } else if (contentLower.includes("package") || contentLower.includes("plan")) {
        botResponse = "We offer three main packages: Basic (food service only), Standard (food service plus basic setup), and Premium (comprehensive service including marketing). Each package can be customized with add-ons like extended hours, additional menu items, or special dietary options. The Package Sales table in your dashboard shows which packages are most popular.";
      } else if (contentLower.includes("report") || contentLower.includes("analytics")) {
        botResponse = "Your dashboard provides comprehensive analytics including daily sales charts, package popularity, and detailed sales reports. You can filter data by date range, cuisine type, or event size. These insights help you understand booking patterns and customer preferences. For custom reports, use the export feature in the Sales Report section.";
      } else if (contentLower.includes("menu") || contentLower.includes("food")) {
        botResponse = "Our food trucks offer diverse cuisines including Mexican, Italian, Asian fusion, BBQ, desserts, and specialty options like vegan and gluten-free. Each vendor's profile shows their full menu with pricing. Many vendors can customize menus for your specific event needs - just mention your requirements when booking.";
      } else {
        botResponse = "Thank you for your message! As your Food Truck Community specialist, I can help with bookings, vendor information, dashboard features, event planning, and any other food truck related questions. Our platform connects you with over 50 unique food trucks and offers tools to manage your events efficiently. How else can I assist you today?";
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
