/**
 * AI Provider Factory
 * Wählt den AI-Service basierend auf Environment Variables
 */

import { AIService } from './aiService';
import germanAIService from './germanAIService';
import openAIService from './openAIService';

type AIProviderType = 'germanai' | 'openai';

class AIProvider {
  private provider: AIProviderType;
  private service: AIService;

  constructor() {
    // Lese AI_PROVIDER aus .env.local (default: germanai)
    this.provider = (process.env.AI_PROVIDER as AIProviderType) || 'germanai';

    console.log(`🤖 Using AI Provider: ${this.provider.toUpperCase()}`);

    this.service = this.getService();
  }

  private getService(): AIService {
    switch (this.provider) {
      case 'openai':
        return openAIService;
      case 'germanai':
      default:
        return germanAIService;
    }
  }

  getAIService(): AIService {
    return this.service;
  }

  getProviderName(): string {
    return this.provider;
  }
}

export default new AIProvider();
