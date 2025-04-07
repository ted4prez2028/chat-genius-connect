import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Send } from "lucide-react";
import { toast } from "sonner";

interface Conversation {
  id: string;
  customer: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  messages: Message[];
  lastMessageAt: Date;
  unreadCount: number;
}

interface Message {
  id: string;
  content: string;
  sender: "customer" | "support";
  createdAt: Date;
  isAI?: boolean;
}

const sampleConversations: Conversation[] = [
  {
    id: "conv-1",
    customer: {
      id: "cust-1",
      name: "John Smith",
      email: "john.smith@example.com",
      avatar: "/avatars/john.jpg",
    },
    messages: [
      {
        id: "msg-1",
        content: "Hi, I need help with my food truck booking for next Friday.",
        sender: "customer",
        createdAt: new Date(2023, 3, 15, 14, 30),
      },
      {
        id: "msg-2",
        content: "Hello John! I'd be happy to help with your booking. Could you please provide the booking reference number?",
        sender: "support",
        createdAt: new Date(2023, 3, 15, 14, 32),
        isAI: true,
      },
    ],
    lastMessageAt: new Date(2023, 3, 15, 14, 32),
    unreadCount: 0,
  },
  {
    id: "conv-2",
    customer: {
      id: "cust-2",
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      avatar: "/avatars/sarah.jpg",
    },
    messages: [
      {
        id: "msg-3",
        content: "Can I get a refund for my canceled order?",
        sender: "customer",
        createdAt: new Date(2023, 3, 14, 10, 15),
      },
    ],
    lastMessageAt: new Date(2023, 3, 14, 10, 15),
    unreadCount: 1,
  },
  {
    id: "conv-3",
    customer: {
      id: "cust-3",
      name: "Michael Brown",
      email: "mbrown@example.com",
      avatar: "/avatars/michael.jpg",
    },
    messages: [
      {
        id: "msg-4",
        content: "I'm interested in becoming a vendor on your platform. What are the requirements?",
        sender: "customer",
        createdAt: new Date(2023, 3, 13, 16, 45),
      },
      {
        id: "msg-5",
        content: "Hi Michael! Thanks for your interest in joining our platform as a vendor. To become a vendor, you'll need to have all necessary permits and licenses for operating a food truck in your area, proof of insurance, and food safety certifications. Would you like me to send you the full application details?",
        sender: "support",
        createdAt: new Date(2023, 3, 13, 17, 0),
        isAI: true,
      },
      {
        id: "msg-6",
        content: "Yes, please send me the full details. I have all the required permits and insurance.",
        sender: "customer",
        createdAt: new Date(2023, 3, 13, 17, 5),
      },
    ],
    lastMessageAt: new Date(2023, 3, 13, 17, 5),
    unreadCount: 1,
  },
];

const ChatSupport = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>(sampleConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isAIResponding, setIsAIResponding] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedConversation?.messages]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const diffDays = Math.floor((today.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `${date.toLocaleDateString([], { weekday: 'long' })} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const selectConversation = (conversation: Conversation) => {
    const updatedConversations = conversations.map(conv => 
      conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
    );
    setConversations(updatedConversations);
    setSelectedConversation(conversation);
  };

  const handleSendMessage = async () => {
    if (!selectedConversation || !newMessage.trim()) return;
    
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      sender: "support",
      createdAt: new Date(),
    };
    
    const updatedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, newMsg],
      lastMessageAt: new Date(),
    };
    
    setConversations(
      conversations.map(conv => 
        conv.id === selectedConversation.id ? updatedConversation : conv
      )
    );
    
    setSelectedConversation(updatedConversation);
    setNewMessage("");
  };

  const simulateAIResponse = async (conversation: Conversation) => {
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    let aiResponse = "I'll look into this and get back to you soon!";
    const lastUserMsg = conversation.messages[conversation.messages.length - 1].content.toLowerCase();
    
    if (lastUserMsg.includes("refund") || lastUserMsg.includes("cancel")) {
      aiResponse = "For refund requests, please provide your order number and the reason for cancellation. Our policy allows full refunds if canceled at least 48 hours before the event.";
    } else if (lastUserMsg.includes("booking") || lastUserMsg.includes("schedule")) {
      aiResponse = "To help with your booking, could you provide more details about your event date, location, and expected number of guests? This will help us recommend the right food trucks for your needs.";
    } else if (lastUserMsg.includes("vendor") || lastUserMsg.includes("join")) {
      aiResponse = "I've sent the vendor application details to your email. You'll need to complete the online form and upload your business documents. If you have any questions during the process, feel free to ask!";
    }
    
    const aiMsg: Message = {
      id: `msg-${Date.now()}`,
      content: aiResponse,
      sender: "support",
      createdAt: new Date(),
      isAI: true,
    };
    
    const updatedConversation = {
      ...conversation,
      messages: [...conversation.messages, aiMsg],
      lastMessageAt: new Date(),
    };
    
    setConversations(
      conversations.map(conv => 
        conv.id === conversation.id ? updatedConversation : conv
      )
    );
    
    setSelectedConversation(updatedConversation);
    setIsAIResponding(false);
  };

  const initiateAIResponse = async () => {
    if (!selectedConversation) return;
    
    setIsAIResponding(true);
    toast.info("AI is being prompted to generate a response...");
    
    await simulateAIResponse(selectedConversation);
    toast.success("AI response generated!");
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">CHAT SUPPORT</h1>
      
      <div className="flex h-[calc(100vh-12rem)] border rounded-lg overflow-hidden">
        <div className="w-1/3 border-r bg-gray-50">
          <div className="p-4 border-b">
            <Input placeholder="Search conversations..." />
          </div>
          
          <div className="overflow-y-auto h-[calc(100%-4rem)]">
            {conversations.map(conversation => (
              <div 
                key={conversation.id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-100 transition-colors ${selectedConversation?.id === conversation.id ? 'bg-gray-200' : ''}`}
                onClick={() => selectConversation(conversation)}
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-brand-pink text-white flex items-center justify-center font-bold text-lg mr-3">
                    {conversation.customer.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900 truncate">{conversation.customer.name}</h3>
                      <span className="text-xs text-gray-500">{formatDate(conversation.lastMessageAt)}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.messages[conversation.messages.length - 1].content}
                    </p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <div className="ml-2 bg-brand-pink text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-brand-pink text-white flex items-center justify-center font-bold text-lg mr-3">
                    {selectedConversation.customer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedConversation.customer.name}</h3>
                    <p className="text-sm text-gray-500">{selectedConversation.customer.email}</p>
                  </div>
                </div>
                <Button variant="outline" onClick={initiateAIResponse}>
                  Generate AI Response
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConversation.messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'support' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender === 'support'
                          ? message.isAI 
                            ? 'bg-purple-100 text-purple-900'
                            : 'bg-brand-pink text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <p>{message.content}</p>
                      <div className="mt-1 text-xs opacity-70 flex justify-between items-center">
                        <span>{message.sender === 'support' ? (message.isAI ? 'AI Support' : 'You') : selectedConversation.customer.name}</span>
                        <span>{message.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isAIResponding && (
                  <div className="flex justify-start">
                    <div className="bg-purple-100 text-purple-900 rounded-lg p-3 max-w-[70%]">
                      <div className="flex items-center space-x-2">
                        <div className="animate-pulse flex space-x-1">
                          <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
                          <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
                          <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
                        </div>
                        <span className="text-sm">AI is typing...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-4 border-t">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center space-x-2"
                >
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isAIResponding}
                  />
                  <Button type="submit" size="icon" disabled={!newMessage.trim() || isAIResponding}>
                    <Send size={18} />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center p-8">
                <div className="bg-brand-pink text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose a conversation from the list to start chatting.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatSupport;
