/**
 * GermanAI Service
 * Direct integration with GermanAI.tech API
 * OpenAI-compatible chat completions API
 */

export interface GermanAIConfig {
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

class GermanAIService {
  private apiUrl: string;
  private apiKey: string;
  private defaultModel: string;

  private systemPrompts: { [key: string]: string } = {
    de: 'Du bist ein hilfreicher Assistent für Arbeitserlaubnis-Anträge in Deutschland. Antworte auf Deutsch. WICHTIG: Antworte OHNE <think> Tags und OHNE Markdown-Formatierung (kein **, __, *, _). Verwende nur einfachen Text.',
    en: 'You are a helpful assistant for work permit applications in Germany. Answer in English. IMPORTANT: Answer WITHOUT <think> tags and WITHOUT markdown formatting (no **, __, *, _). Use plain text only.',
    tr: 'Almanya\'da çalışma izni başvuruları için yardımcı bir asistansınız. Türkçe cevap verin. ÖNEMLİ: <think> etiketleri ve markdown formatlaması OLMADAN cevap verin (**, __, *, _ yok). Sadece düz metin kullanın.',
    ar: 'أنت مساعد مفيد لطلبات تصاريح العمل في ألمانيا. أجب بالعربية. مهم: أجب بدون علامات <think> وبدون تنسيق markdown (لا **, __, *, _). استخدم نصًا عاديًا فقط.',
    pl: 'Jesteś pomocnym asystentem do wniosków o pozwolenie na pracę w Niemczech. Odpowiadaj po polsku. WAŻNE: Odpowiadaj BEZ tagów <think> i BEZ formatowania markdown (bez **, __, *, _). Używaj tylko zwykłego tekstu.',
    uk: 'Ви корисний асистент для заявок на дозвіл на роботу в Німеччині. Відповідайте українською. ВАЖЛИВО: Відповідайте БЕЗ тегів <think> і БЕЗ форматування markdown (без **, __, *, _). Використовуйте лише простий текст.',
    es: 'Eres un asistente útil para solicitudes de permisos de trabajo en Alemania. Responde en español. IMPORTANTE: Responde SIN etiquetas <think> y SIN formato markdown (sin **, __, *, _). Usa solo texto plano.',
    fr: 'Vous êtes un assistant utile pour les demandes de permis de travail en Allemagne. Répondez en français. IMPORTANT : Répondez SANS balises <think> et SANS formatage markdown (pas de **, __, *, _). Utilisez uniquement du texte brut.'
  };

  constructor() {
    this.apiUrl = process.env.GERMANAI_API_URL || 'https://germanai.tech/api/v1/chat/completions';
    this.apiKey = process.env.GERMANAI_API_KEY || '';
    this.defaultModel = process.env.GERMANAI_MODEL || 'qwen3:32b';

    if (!this.apiKey) {
      console.warn('⚠️ GERMANAI_API_KEY not set in environment');
    }
  }

  async chat(
    messages: ChatMessage[],
    config?: GermanAIConfig
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

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages: allMessages,
          temperature: config?.temperature || 0.7,
          max_tokens: config?.maxTokens || 2048
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('GermanAI API error:', response.status, errorText);
        throw new Error(`GermanAI API error: ${response.status}`);
      }

      const data = await response.json();
      let content = data.choices[0].message.content;

      // Clean up response: remove <think> tags and markdown formatting
      content = this.cleanResponse(content);

      return {
        message: content,
        model,
        language
      };
    } catch (error) {
      console.error('GermanAI chat error:', error);
      throw new Error('Failed to get response from GermanAI');
    }
  }

  private cleanResponse(content: string): string {
    // Remove <think>...</think> tags and their content
    content = content.replace(/<think>[\s\S]*?<\/think>/gi, '');

    // Remove markdown formatting
    // Bold: **text** or __text__
    content = content.replace(/\*\*(.+?)\*\*/g, '$1');
    content = content.replace(/__(.+?)__/g, '$1');

    // Italic: *text* or _text_
    content = content.replace(/\*(.+?)\*/g, '$1');
    content = content.replace(/_(.+?)_/g, '$1');

    // Clean up multiple consecutive newlines
    content = content.replace(/\n{3,}/g, '\n\n');

    // Trim whitespace
    content = content.trim();

    return content;
  }

  async listModels(): Promise<string[]> {
    // GermanAI doesn't have a list models endpoint in this example
    // Return default models
    return [
      'qwen3:32b',
      'qwen3:14b',
      'qwen2.5:7b',
      'llama3.3:70b'
    ];
  }

  async checkHealth(): Promise<boolean> {
    try {
      // Simple health check with minimal request
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.defaultModel,
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 1
        })
      });

      return response.ok;
    } catch (error) {
      console.error('GermanAI health check failed:', error);
      return false;
    }
  }

  async streamChat(
    messages: ChatMessage[],
    config?: GermanAIConfig,
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

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages: allMessages,
          temperature: config?.temperature || 0.7,
          max_tokens: config?.maxTokens || 2048,
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`GermanAI API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader available');
      }

      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || '';

              if (content) {
                fullResponse += content;
                if (onChunk) {
                  onChunk(content);
                }
              }
            } catch (e) {
              // Skip invalid JSON chunks
            }
          }
        }
      }

      return fullResponse;
    } catch (error) {
      console.error('GermanAI stream chat error:', error);
      throw new Error('Failed to stream response from GermanAI');
    }
  }
}

export default new GermanAIService();
