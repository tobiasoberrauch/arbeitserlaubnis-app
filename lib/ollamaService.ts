import { Ollama } from 'ollama';

export interface OllamaConfig {
  model: string;
  temperature?: number;
  language?: string;
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

class OllamaService {
  private ollama: Ollama;
  private defaultModel: string = 'qwen2.5:7b';
  private systemPrompts: { [key: string]: string } = {
    de: 'Du bist ein hilfreicher Assistent für Arbeitserlaubnis-Anträge in Deutschland. Antworte auf Deutsch.',
    en: 'You are a helpful assistant for work permit applications in Germany. Answer in English.',
    tr: 'Almanya\'da çalışma izni başvuruları için yardımcı bir asistansınız. Türkçe cevap verin.',
    ar: 'أنت مساعد مفيد لطلبات تصاريح العمل في ألمانيا. أجب بالعربية.',
    pl: 'Jesteś pomocnym asystentem do wniosków o pozwolenie na pracę w Niemczech. Odpowiadaj po polsku.',
    uk: 'Ви корисний асистент для заявок на дозвіл на роботу в Німеччині. Відповідайте українською.'
  };

  constructor() {
    this.ollama = new Ollama({
      host: process.env.OLLAMA_HOST || 'http://localhost:11434'
    });
  }

  async chat(
    messages: ChatMessage[], 
    config?: OllamaConfig
  ): Promise<ChatResponse> {
    try {
      const model = config?.model || this.defaultModel;
      const language = config?.language || 'de';
      
      // Add system prompt for language
      const systemMessage: ChatMessage = {
        role: 'system',
        content: this.systemPrompts[language] || this.systemPrompts['de']
      };

      const allMessages = [systemMessage, ...messages];

      const response = await this.ollama.chat({
        model,
        messages: allMessages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        options: {
          temperature: config?.temperature || 0.7,
        }
      });

      return {
        message: response.message.content,
        model,
        language
      };
    } catch (error) {
      console.error('Ollama chat error:', error);
      throw new Error('Failed to get response from Ollama');
    }
  }

  async listModels(): Promise<string[]> {
    try {
      const response = await this.ollama.list();
      return response.models.map(model => model.name);
    } catch (error) {
      console.error('Error listing models:', error);
      return [];
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      await this.ollama.list();
      return true;
    } catch (error) {
      console.error('Ollama health check failed:', error);
      return false;
    }
  }

  async streamChat(
    messages: ChatMessage[],
    config?: OllamaConfig,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    try {
      const model = config?.model || this.defaultModel;
      const language = config?.language || 'de';
      
      const systemMessage: ChatMessage = {
        role: 'system',
        content: this.systemPrompts[language] || this.systemPrompts['de']
      };

      const allMessages = [systemMessage, ...messages];

      const stream = await this.ollama.chat({
        model,
        messages: allMessages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        stream: true,
        options: {
          temperature: config?.temperature || 0.7,
        }
      });

      let fullResponse = '';
      for await (const chunk of stream) {
        const content = chunk.message.content;
        fullResponse += content;
        if (onChunk) {
          onChunk(content);
        }
      }

      return fullResponse;
    } catch (error) {
      console.error('Ollama stream chat error:', error);
      throw new Error('Failed to stream response from Ollama');
    }
  }
}

export default new OllamaService();