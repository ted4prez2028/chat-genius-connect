
import { toast } from "sonner";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

// This is just a simulation of the ChatGPT API for demo purposes
// In a real app, this would call the OpenAI API
export const generateChatResponse = async (messages: Message[]): Promise<string> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const lastUserMessage = messages.findLast(m => m.role === "user")?.content.toLowerCase() || "";
    
    // Simple pattern matching for demo
    if (lastUserMessage.includes("hello") || lastUserMessage.includes("hi")) {
      return "Hello! How can I help you with food trucks today?";
    } else if (lastUserMessage.includes("book") || lastUserMessage.includes("reservation")) {
      return "To book a food truck, you can use the 'Book a Truck' button on our homepage, or browse our vendors and select the one you'd like to book.";
    } else if (lastUserMessage.includes("price") || lastUserMessage.includes("cost")) {
      return "Pricing varies depending on the vendor, event size, and duration. You can get detailed pricing information on each vendor's page.";
    } else if (lastUserMessage.includes("vendor") || lastUserMessage.includes("become")) {
      return "To become a vendor, click on 'Become a Vendor' in our navigation and fill out the application form. Our team will review your submission within 1-2 business days.";
    } else {
      return "Thank you for your message. Our team is available to help with any food truck related questions. Is there anything specific you'd like to know about our services?";
    }
  } catch (error) {
    console.error("Error generating AI response:", error);
    toast.error("Failed to generate AI response");
    return "I'm sorry, I'm having trouble responding right now. Please try again later.";
  }
};
