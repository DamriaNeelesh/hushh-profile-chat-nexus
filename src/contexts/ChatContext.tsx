'use client'
import React, { createContext, useContext, useReducer } from "react";
import { ChatContext, ChatMessage, ChatRequest, ChatResponse, ChatState } from "../types/chat";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

type ChatAction =
  | { type: "SET_CONTEXT"; payload: ChatContext }
  | { type: "SEND_MESSAGE_START"; payload: { message: ChatMessage, contextId: string } }
  | { type: "SEND_MESSAGE_SUCCESS"; payload: { message: ChatMessage, contextId: string } }
  | { type: "SEND_MESSAGE_FAILURE"; payload: { error: string } }
  | { type: "CLEAR_CONTEXT" };

interface ChatContextProviderType {
  state: ChatState;
  sendMessage: (content: string) => Promise<void>;
  setContext: (context: ChatContext) => void;
  clearContext: () => void;
  getContextId: (context: ChatContext) => string;
}

const initialContext: ChatContext = {
  type: "myProfile",
};

const initialState: ChatState = {
  currentContext: initialContext,
  messages: {},
  isLoading: false,
};

const ChatContextProvider = createContext<ChatContextProviderType | undefined>(undefined);

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case "SET_CONTEXT":
      return { ...state, currentContext: action.payload };
    case "SEND_MESSAGE_START": {
      const { contextId } = action.payload;
      const updatedMessages = { ...state.messages };
      
      if (!updatedMessages[contextId]) {
        updatedMessages[contextId] = [];
      }
      
      updatedMessages[contextId] = [...updatedMessages[contextId], action.payload.message];
      
      return {
        ...state,
        isLoading: true,
        messages: updatedMessages,
      };
    }
    case "SEND_MESSAGE_SUCCESS": {
      const { contextId } = action.payload;
      const updatedMessages = { ...state.messages };
      
      if (!updatedMessages[contextId]) {
        updatedMessages[contextId] = [];
      }
      
      updatedMessages[contextId] = [...updatedMessages[contextId], action.payload.message];
      
      return {
        ...state,
        isLoading: false,
        messages: updatedMessages,
      };
    }
    case "SEND_MESSAGE_FAILURE":
      return {
        ...state,
        isLoading: false,
      };
    case "CLEAR_CONTEXT":
      return {
        ...state,
        currentContext: initialContext,
      };
    default:
      return state;
  }
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { toast } = useToast();

  const getContextId = (context: ChatContext): string => {
    if (context.type === "myProfile") {
      return "myProfile";
    } else if (context.type === "delegated" && context.targetUserId) {
      return `delegated-${context.targetUserId}`;
    } else {
      return "unknown";
    }
  };

  const setContext = (context: ChatContext) => {
    dispatch({ type: "SET_CONTEXT", payload: context });
  };

  const clearContext = () => {
    dispatch({ type: "CLEAR_CONTEXT" });
  };

  const sendMessage = async (content: string) => {
    const currentContextId = getContextId(state.currentContext);
    
    // Create user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      content,
      role: "user",
      timestamp: new Date().toISOString(),
    };

    // Update state with user message
    dispatch({ 
      type: "SEND_MESSAGE_START", 
      payload: { message: userMessage, contextId: currentContextId } 
    });

    try {
      // Prepare request for API
      const chatRequest: ChatRequest = {
        query: content,
        context: state.currentContext,
      };

      // Mock API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate response based on context
      let responseText = "";
      const currentContext = state.currentContext;
      
      if (currentContext.type === "myProfile") {
        responseText = `Responding about Your Profile regarding '${content}'`;
      } else if (currentContext.type === "delegated" && currentContext.grantorName) {
        responseText = `Responding about ${currentContext.grantorName}'s Profile regarding '${content}' (Permission check simulated)`;
      } else {
        responseText = `I'm not sure which Profile you're trying to access. Please try again.`;
      }

      // Create assistant message
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        content: responseText,
        role: "assistant",
        timestamp: new Date().toISOString(),
      };

      // Update state with assistant message
      dispatch({
        type: "SEND_MESSAGE_SUCCESS",
        payload: { message: assistantMessage, contextId: currentContextId },
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
      dispatch({ type: "SEND_MESSAGE_FAILURE", payload: { error: "Failed to send message" } });
    }
  };

  return (
    <ChatContextProvider.Provider value={{ state, sendMessage, setContext, clearContext, getContextId }}>
      {children}
    </ChatContextProvider.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContextProvider);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
