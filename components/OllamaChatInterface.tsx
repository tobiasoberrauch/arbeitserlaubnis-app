'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Bot, User, Settings, Languages, RefreshCw } from 'lucide-react';

interface OllamaChatInterfaceProps {
  selectedLanguage: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
}

interface OllamaStatus {
  models: string[];
  healthy: boolean;
  defaultModel: string;
}

export default function OllamaChatInterface({ selectedLanguage }: OllamaChatInterfaceProps) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedModel, setSelectedModel] = useState('qwen2.5:7b');
  const [models, setModels] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [streamingText, setStreamingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    fetchModels();
    // Add initial greeting
    const greeting: Message = {
      id: '1',
      role: 'assistant',
      content: getGreeting(),
      timestamp: new Date(),
      model: selectedModel
    };
    setMessages([greeting]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  const getGreeting = () => {
    const greetings: { [key: string]: string } = {
      de: 'Hallo! Ich bin Ihr KI-Assistent für Arbeitserlaubnis-Fragen. Wie kann ich Ihnen helfen?',
      en: 'Hello! I am your AI assistant for work permit questions. How can I help you?',
      tr: 'Merhaba! Çalışma izni soruları için AI asistanınızım. Size nasıl yardımcı olabilirim?',
      ar: 'مرحبا! أنا مساعدك الذكي لأسئلة تصريح العمل. كيف يمكنني مساعدتك؟',
      pl: 'Cześć! Jestem Twoim asystentem AI do pytań o pozwolenie na pracę. Jak mogę pomóc?',
      uk: 'Привіт! Я ваш AI-асистент з питань дозволу на роботу. Як я можу допомогти?'
    };
    return greetings[selectedLanguage] || greetings['de'];
  };

  const fetchModels = async () => {
    try {
      const response = await fetch('/api/ollama');
      const data: OllamaStatus = await response.json();
      if (data.models && data.models.length > 0) {
        setModels(data.models);
        setSelectedModel(data.defaultModel || data.models[0]);
      }
    } catch (error) {
      console.error('Failed to fetch models:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsStreaming(true);
    setStreamingText('');

    // Prepare messages for API
    const apiMessages = [...messages, userMessage].map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    try {
      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();

      const response = await fetch('/api/ollama', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
          model: selectedModel,
          language: selectedLanguage,
          temperature,
          stream: true
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      if (reader) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          model: selectedModel
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                assistantMessage.content = accumulatedText;
                setMessages(prev => [...prev, assistantMessage]);
                setStreamingText('');
                break;
              }
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  accumulatedText += parsed.content;
                  setStreamingText(accumulatedText);
                }
              } catch (e) {
                // Ignore parse errors
              }
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Chat error:', error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Entschuldigung, es gab einen Fehler. Bitte versuchen Sie es erneut.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      setStreamingText('');
      abortControllerRef.current = null;
    }
  };

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
      setIsLoading(false);
      setStreamingText('');
    }
  };

  const clearChat = () => {
    setMessages([{
      id: Date.now().toString(),
      role: 'assistant',
      content: getGreeting(),
      timestamp: new Date(),
      model: selectedModel
    }]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-3 border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-primary-600" />
            <div>
              <h2 className="font-semibold text-gray-900">Ollama Chat Assistant</h2>
              <p className="text-sm text-gray-600">
                Model: {selectedModel} | Language: {selectedLanguage.toUpperCase()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={clearChat}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Clear chat"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white border-b px-4 py-3">
          <div className="max-w-6xl mx-auto space-y-3">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Model:</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="px-3 py-1 border rounded-lg text-sm"
              >
                {models.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">
                Temperature: {temperature}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="flex-1 max-w-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-600" />
                </div>
              )}
              <div
                className={`max-w-2xl px-4 py-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-900 shadow-sm border'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <div className={`text-xs mt-2 flex items-center gap-2 ${
                  message.role === 'user' ? 'text-primary-200' : 'text-gray-500'
                }`}>
                  <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {message.model && <span>• {message.model}</span>}
                </div>
              </div>
              {message.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              )}
            </div>
          ))}
          
          {/* Streaming Message */}
          {isStreaming && streamingText && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-600" />
              </div>
              <div className="max-w-2xl px-4 py-3 rounded-lg bg-white text-gray-900 shadow-sm border">
                <p className="whitespace-pre-wrap">{streamingText}</p>
                <div className="mt-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Loading Indicator */}
          {isLoading && !streamingText && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-600" />
              </div>
              <div className="bg-white px-4 py-3 rounded-lg shadow-sm border">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t px-4 py-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`${t('chatbot.inputPlaceholder') || 'Type your message...'}...`}
              className="flex-1 px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isLoading}
            />
            {isStreaming ? (
              <button
                type="button"
                onClick={stopStreaming}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                Stop
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">{t('chatbot.send') || 'Send'}</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}