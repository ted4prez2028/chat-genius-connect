
import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@/contexts/ChatContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { messages, sendMessage, isLoading } = useChat();
  const { isAuthenticated, user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;
    
    if (!isAuthenticated) {
      toast.error("Please login to send messages");
      return;
    }

    sendMessage(message);
    setMessage("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl w-80 sm:w-96 overflow-hidden flex flex-col max-h-[500px] border border-gray-200">
          <div className="bg-brand-pink p-4 text-white flex justify-between items-center">
            <h3 className="font-semibold">Food Truck Support</h3>
            <Button variant="ghost" size="icon" onClick={toggleChat} className="text-white hover:bg-pink-700 h-8 w-8">
              <X size={18} />
            </Button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto max-h-96 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MessageSquare className="mx-auto h-12 w-12 mb-4 text-gray-400" />
                <p>Welcome to Food Truck Community support!</p>
                <p className="text-sm mt-2">How can we help you today?</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 max-w-[80%] ${
                    msg.role === "user"
                      ? "ml-auto bg-brand-pink text-white rounded-t-lg rounded-bl-lg"
                      : "bg-gray-200 text-gray-800 rounded-t-lg rounded-br-lg"
                  } p-3`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs mt-1 opacity-70 text-right">
                    {msg.role === "user" ? "You" : "Support"} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4">
            <div className="flex">
              <Textarea
                placeholder="Type your message..."
                className="resize-none flex-1 mr-2 h-10 py-2"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={isLoading}
                className="bg-brand-pink hover:bg-pink-700"
              >
                <Send size={18} />
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <Button
          onClick={toggleChat}
          className="bg-brand-pink hover:bg-pink-700 rounded-full h-14 w-14 flex items-center justify-center shadow-lg"
        >
          <MessageSquare size={24} />
        </Button>
      )}
    </div>
  );
};

export default ChatWidget;
