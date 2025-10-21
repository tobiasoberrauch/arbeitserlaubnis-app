/**
 * AI Service Interface
 * Abstrakte Schnittstelle für verschiedene AI-Provider
 */

export interface AIConfig {
  model?: string;
  temperature?: number;
  language?: string;
  maxTokens?: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  message: string;
  model: string;
  language?: string;
}

export interface AIService {
  chat(messages: ChatMessage[], config?: AIConfig): Promise<ChatResponse>;
  listModels(): Promise<string[]>;
  checkHealth(): Promise<boolean>;
}
