
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "@/contexts/ChatContext";
import { Loader2, SendIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import ChatContextIndicator from "./ChatContextIndicator";

const ChatInterface = () => {
  const { state, sendMessage } = useChat();
  const [query, setQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { currentContext } = state;
  const contextId = currentContext.type === "myProfile" 
    ? "myProfile" 
    : `delegated-${currentContext.targetUserId}`;
  
  const messages = state.messages[contextId] || [];
  const isLoading = state.isLoading;

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    
    await sendMessage(query.trim());
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full">
      <ChatContextIndicator />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center max-w-md">
              <h3 className="font-medium text-lg mb-2">Start a conversation</h3>
              <p>
                {currentContext.type === "myProfile" 
                  ? "Ask your Profile about your information" 
                  : `Ask ${currentContext.grantorName}'s Profile a question`}
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "chat-bubble",
                message.role === "user" 
                  ? "chat-bubble-user" 
                  : currentContext.type === "delegated" 
                    ? "chat-bubble-delegated" 
                    : "chat-bubble-assistant"
              )}
            >
              {message.content}
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="chat-bubble chat-bubble-assistant flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Thinking...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={!query.trim() || isLoading}>
            <SendIcon className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
