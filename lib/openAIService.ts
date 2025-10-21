/**
 * OpenAI Service
 * Integration with OpenAI API
 */

import { AIService, AIConfig, ChatMessage, ChatResponse } from './aiService';

class OpenAIService implements AIService {
  private apiUrl: string = 'https://api.openai.com/v1/chat/completions';
  private apiKey: string;
  private defaultModel: string;

  private systemPrompts: { [key: string]: string } = {
    de: 'Du bist ein hilfreicher Assistent für Arbeitserlaubnis-Anträge in Deutschland. Antworte auf Deutsch.',
    en: 'You are a helpful assistant for work permit applications in Germany. Answer in English.',
    tr: 'Almanya\'da çalışma izni başvuruları için yardımcı bir asistansınız. Türkçe cevap verin.',
    ar: 'أنت مساعد مفيد لطلبات تصاريح العمل في ألمانيا. أجب بالعربية.',
    pl: 'Jesteś pomocnym asystentem do wniosków o pozwolenie na pracę w Niemczech. Odpowiadaj po polsku.',
    uk: 'Ви корисний асистент для заявок на дозвіл на роботу в Німеччині. Відповідайте українською.',
    es: 'Eres un asistente útil para solicitudes de permisos de trabajo en Alemania. Responde en español.',
    fr: 'Vous êtes un assistant utile pour les demandes de permis de travail en Allemagne. Répondez en français.'
  };

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
    this.defaultModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    if (!this.apiKey) {
      console.warn('⚠️ OPENAI_API_KEY not set in environment');
    }
  }

  async chat(
    messages: ChatMessage[],
    config?: AIConfig
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

      // Build request body
      const requestBody: any = {
        model,
        messages: allMessages,
        max_completion_tokens: config?.maxTokens || 2048
      };

      // Only add temperature if it's exactly 1 (OpenAI's new models only support default temperature of 1)
      // For other values, we omit it to use the default
      if (config?.temperature === 1) {
        requestBody.temperature = 1;
      }

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI API error:', response.status, errorText);
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      return {
        message: content,
        model,
        language
      };
    } catch (error) {
      console.error('OpenAI chat error:', error);
      throw new Error('Failed to get response from OpenAI');
    }
  }

  async listModels(): Promise<string[]> {
    return [
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-4-turbo',
      'gpt-3.5-turbo'
    ];
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await this.chat([
        { role: 'user', content: 'Say OK if you receive this.' }
      ], { maxTokens: 10 });
      return !!response.message;
    } catch (error) {
      console.error('OpenAI health check failed:', error);
      return false;
    }
  }
}

export default new OpenAIService();
