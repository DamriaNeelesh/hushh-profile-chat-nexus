
export type ChatContextType = 'myProfile' | 'delegated';

export interface ChatContext {
  type: ChatContextType;
  targetUserId?: string;
  grantorName?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatState {
  currentContext: ChatContext;
  messages: Record<string, ChatMessage[]>;
  isLoading: boolean;
}

export interface ChatRequest {
  query: string;
  context: ChatContext;
}

export interface ChatResponse {
  response: string;
}
