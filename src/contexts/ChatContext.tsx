
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
      // For demo purposes, use simulated responses
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let botResponse: string;
      
      // Simple response logic based on keywords
      if (content.toLowerCase().includes("hello") || content.toLowerCase().includes("hi")) {
        botResponse = "Hello! How can I help you with food trucks today?";
      } else if (content.toLowerCase().includes("book") || content.toLowerCase().includes("reservation")) {
        botResponse = "To book a food truck, you can use the 'Book a Truck' button on our homepage, or browse our vendors and select the one you'd like to book.";
      } else if (content.toLowerCase().includes("price") || content.toLowerCase().includes("cost")) {
        botResponse = "Pricing varies depending on the vendor, event size, and duration. You can get detailed pricing information on each vendor's page.";
      } else if (content.toLowerCase().includes("vendor") || content.toLowerCase().includes("become")) {
        botResponse = "To become a vendor, click on 'Become a Vendor' in our navigation and fill out the application form. Our team will review your submission within 1-2 business days.";
      } else {
        botResponse = "Thank you for your message. Our team is available to help with any food truck related questions. Is there anything specific you'd like to know about our services?";
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
