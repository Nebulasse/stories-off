export type MessageStyle = 'bold' | 'romantic' | 'random';

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Message {
  id: string;
  user_id: string;
  style: MessageStyle;
  input_text: string;
  generated_response: string;
  created_at: string;
  is_favorite: boolean;
}

export interface GenerationRequest {
  text: string;
  style: MessageStyle;
  screenshot?: File;
}

export interface GenerationResponse {
  responses: string[];
  context_analysis?: {
    tone: string;
    key_phrases: string[];
  };
}

export interface GeneratedResponse {
  id: string;
  text: string;
  style: MessageStyle;
  created_at: string;
  user_id: string;
}

export interface Conversation {
  id: string;
  messages: string[];
  style: MessageStyle;
  created_at: string;
  user_id: string;
} 