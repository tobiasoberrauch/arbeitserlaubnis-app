'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, ArrowLeft, ArrowRight, Save, Eye } from 'lucide-react';
import { formQuestions } from '@/lib/formQuestions';

interface ChatbotInterfaceProps {
  onComplete: (data: any) => void;
  selectedLanguage: string;
  formData: any;
  setFormData: (data: any) => void;
}

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

export default function ChatbotInterface({ 
  onComplete, 
  selectedLanguage, 
  formData, 
  setFormData 
}: ChatbotInterfaceProps) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const questions = formQuestions[selectedLanguage] || formQuestions['de'];

  useEffect(() => {
    // Initial greeting
    const greeting: Message = {
      id: '1',
      type: 'bot',
      content: t('chatbot.greeting'),
      timestamp: new Date(),
    };
    setMessages([greeting]);
    
    // Ask first question after a delay
    setTimeout(() => {
      askQuestion(0);
    }, 1500);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const askQuestion = (questionIndex: number) => {
    if (questionIndex >= questions.length) {
      onComplete(formData);
      return;
    }

    setIsTyping(true);
    setTimeout(() => {
      const question = questions[questionIndex];
      const botMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: question.question,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Save form data
    const question = questions[currentQuestion];
    setFormData({
      ...formData,
      [question.field]: inputValue,
    });

    // Clear input and move to next question
    setInputValue('');
    const nextQuestion = currentQuestion + 1;
    setCurrentQuestion(nextQuestion);
    
    if (nextQuestion < questions.length) {
      askQuestion(nextQuestion);
    } else {
      // All questions answered
      setTimeout(() => {
        const completionMessage: Message = {
          id: Date.now().toString(),
          type: 'bot',
          content: 'Vielen Dank! Alle Informationen wurden erfasst. Lass uns deine Eingaben überprüfen.',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, completionMessage]);
        setTimeout(() => {
          onComplete(formData);
        }, 2000);
      }, 1000);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      askQuestion(currentQuestion - 1);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-semibold text-gray-900">Arbeitserlaubnis Formular</h2>
              <p className="text-sm text-gray-600">
                Frage {currentQuestion + 1} von {questions.length}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Save className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Eye className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white px-4 py-2">
        <div className="max-w-4xl mx-auto">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-md px-4 py-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-900 shadow-sm'
                }`}
              >
                <p>{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-primary-200' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-3 rounded-lg shadow-sm">
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
              placeholder="Deine Antwort eingeben..."
              className="flex-1 px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              <span className="hidden sm:inline">Senden</span>
            </button>
          </div>
          
          {/* Quick Actions */}
          {questions[currentQuestion]?.examples && (
            <div className="mt-3 flex flex-wrap gap-2">
              <p className="text-sm text-gray-600 w-full">Beispiele:</p>
              {questions[currentQuestion].examples.map((example: string, index: number) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setInputValue(example)}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}