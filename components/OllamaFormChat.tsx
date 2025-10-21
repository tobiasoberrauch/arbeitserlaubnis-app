'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Globe, Check, AlertCircle, HelpCircle, FileText, Download } from 'lucide-react';
import { generatePDF } from '@/lib/pdfGenerator';
import { formatAIResponse } from '@/lib/formatAIResponse';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  fieldId?: string;
  validated?: boolean;
}

interface FormData {
  [key: string]: string;
}

export default function OllamaFormChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('de');
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [showHelp, setShowHelp] = useState(false);
  const [currentFieldId, setCurrentFieldId] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const totalSteps = 24;
  const progress = ((currentStep / totalSteps) * 100);

  const supportedLanguages = [
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'uk', name: 'Українська', flag: '🇺🇦' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
    { code: 'ur', name: 'اردو', flag: '🇵🇰' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'th', name: 'ไทย', flag: '🇹🇭' },
    { code: 'ro', name: 'Română', flag: '🇷🇴' },
    { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
    { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
    { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' }
  ];

  useEffect(() => {
    startForm();
  }, [selectedLanguage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startForm = async () => {
    setMessages([]);
    setCurrentStep(0);
    setFormData({});
    setIsComplete(false);
    setShowSummary(false);
    
    // Welcome message
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      role: 'system',
      content: getWelcomeMessage(),
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
    
    // Get first question
    setTimeout(() => {
      askNextQuestion();
    }, 1000);
  };

  const getWelcomeMessage = () => {
    const messages: { [key: string]: string } = {
      de: '🎯 Willkommen zum Arbeitserlaubnis-Assistenten!\n\nIch werde Sie Schritt für Schritt durch den Antragsprozess führen. Bitte beantworten Sie jede Frage sorgfältig.',
      en: '🎯 Welcome to the Work Permit Assistant!\n\nI will guide you step by step through the application process. Please answer each question carefully.',
      tr: '🎯 Çalışma İzni Asistanına Hoş Geldiniz!\n\nBaşvuru sürecinde size adım adım rehberlik edeceğim. Lütfen her soruyu dikkatle cevaplayın.',
      ar: '🎯 مرحباً بك في مساعد تصريح العمل!\n\nسأقوم بإرشادك خطوة بخطوة خلال عملية التقديم. يرجى الإجابة على كل سؤال بعناية.',
      pl: '🎯 Witamy w Asystencie Pozwolenia na Pracę!\n\nPrzeprowadzę Cię krok po kroku przez proces aplikacji. Proszę odpowiadać na każde pytanie dokładnie.',
      uk: '🎯 Ласкаво просимо до Асистента Дозволу на Роботу!\n\nЯ проведу вас крок за кроком через процес подання заявки. Будь ласка, відповідайте на кожне питання уважно.',
      es: '🎯 ¡Bienvenido al Asistente de Permiso de Trabajo!\n\nTe guiaré paso a paso a través del proceso de solicitud. Por favor, responde cada pregunta cuidadosamente.',
      fr: '🎯 Bienvenue dans l\'Assistant de Permis de Travail!\n\nJe vais vous guider étape par étape dans le processus de demande. Veuillez répondre à chaque question avec soin.'
    };
    return messages[selectedLanguage] || messages['en'];
  };

  const askNextQuestionForStep = async (step: number) => {
    console.log('📋 askNextQuestionForStep called. Step:', step, 'Total:', totalSteps);

    if (step >= totalSteps) {
      console.log('🎉 Form complete! Generating summary...');
      completeForm();
      return;
    }

    setIsLoading(true);
    try {
      const context = {
        language: selectedLanguage,
        currentStep: step,
        totalSteps,
        fields: Object.entries(formData).map(([id, value]) => ({
          id,
          value,
          validated: true
        })),
        userInfo: formData
      };

      console.log('📤 Requesting next question for step', step, ':', context);

      const response = await fetch('/api/chat/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'nextQuestion',
          context
        })
      });

      if (!response.ok) {
        console.error('❌ Next question request failed:', response.status);
        throw new Error(`Failed to get next question: ${response.status}`);
      }

      const data = await response.json();
      console.log('📥 Received question:', data);

      setCurrentFieldId(data.fieldId);

      const questionMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.question,
        fieldId: data.fieldId,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, questionMessage]);
      console.log('✅ Question added to messages');
    } catch (error) {
      console.error('❌ Error getting question:', error);

      // Show error to user
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'system',
        content: `❌ Error loading next question. Please refresh the page. ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const askNextQuestion = async () => {
    return askNextQuestionForStep(currentStep);
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

    try {
      // Validate answer
      console.log('🔍 Validating answer:', { fieldId: currentFieldId, answer: inputValue, language: selectedLanguage });

      const validationResponse = await fetch('/api/chat/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'validate',
          fieldId: currentFieldId,
          answer: inputValue,
          language: selectedLanguage
        })
      });

      if (!validationResponse.ok) {
        console.error('❌ Validation request failed:', validationResponse.status);
        throw new Error(`Validation failed with status ${validationResponse.status}`);
      }

      const validation = await validationResponse.json();
      console.log('✅ Validation result:', validation);

      if (!validation.valid) {
        const errorMessage: Message = {
          id: Date.now().toString(),
          role: 'system',
          content: `⚠️ ${validation.message}`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsLoading(false);
        return;
      }

      // Save validated answer
      const valueToSave = validation.correctedValue && validation.correctedValue.trim()
        ? validation.correctedValue
        : inputValue;

      console.log('💾 Saving value:', { fieldId: currentFieldId, value: valueToSave });

      setFormData(prev => ({
        ...prev,
        [currentFieldId]: valueToSave
      }));

      // Confirmation message
      const confirmMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: `✅ ${getConfirmationMessage()} "${valueToSave}"`,
        timestamp: new Date(),
        validated: true
      };
      setMessages(prev => [...prev, confirmMessage]);

      // Move to next question immediately
      console.log('➡️ Moving to next question. Current step:', currentStep);
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);

      // Ask next question immediately (don't wait for state update)
      console.log('🎯 Asking next question for step:', nextStep);
      setTimeout(() => {
        if (nextStep >= totalSteps) {
          console.log('🎉 Form complete!');
          completeForm();
        } else {
          askNextQuestionForStep(nextStep);
        }
      }, 300);
    } catch (error) {
      console.error('❌ Error processing answer:', error);

      // Show error to user
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'system',
        content: `❌ Error processing your answer. Please try again. ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getConfirmationMessage = () => {
    const messages: { [key: string]: string } = {
      de: 'Gespeichert:',
      en: 'Saved:',
      tr: 'Kaydedildi:',
      ar: 'تم الحفظ:',
      pl: 'Zapisano:',
      uk: 'Збережено:',
      es: 'Guardado:',
      fr: 'Enregistré:'
    };
    return messages[selectedLanguage] || messages['en'];
  };

  const completeForm = async () => {
    setIsComplete(true);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'summary',
          formData,
          language: selectedLanguage
        })
      });

      const data = await response.json();
      setSummary(data.summary);
      setShowSummary(true);

      const completionMessage: Message = {
        id: Date.now().toString(),
        role: 'system',
        content: `🎉 ${getCompletionMessage()}\n\n${data.summary}`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, completionMessage]);
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCompletionMessage = () => {
    const messages: { [key: string]: string } = {
      de: 'Formular erfolgreich ausgefüllt! Hier ist Ihre Zusammenfassung:',
      en: 'Form successfully completed! Here is your summary:',
      tr: 'Form başarıyla tamamlandı! İşte özetiniz:',
      ar: 'تم إكمال النموذج بنجاح! إليك الملخص:',
      pl: 'Formularz został pomyślnie wypełniony! Oto podsumowanie:',
      uk: 'Форму успішно заповнено! Ось ваше резюме:',
      es: '¡Formulario completado con éxito! Aquí está tu resumen:',
      fr: 'Formulaire complété avec succès! Voici votre résumé:'
    };
    return messages[selectedLanguage] || messages['en'];
  };

  const getHelp = async () => {
    if (!currentFieldId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'help',
          fieldId: currentFieldId,
          language: selectedLanguage
        })
      });

      const data = await response.json();
      
      const helpMessage: Message = {
        id: Date.now().toString(),
        role: 'system',
        content: `ℹ️ ${data.help}`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, helpMessage]);
    } catch (error) {
      console.error('Error getting help:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = async () => {
    try {
      const pdfBytes = await generatePDF(formData);
      // Convert Uint8Array to Blob for download
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `arbeitserlaubnis_${Date.now()}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg px-4 py-3">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="font-bold text-gray-900">Arbeitserlaubnis AI Assistant (GermanAI)</h2>
                <p className="text-sm text-gray-600">
                  Step {currentStep + 1} of {totalSteps}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
              >
                {supportedLanguages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>

              <button
                onClick={getHelp}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Get help"
                disabled={!currentFieldId || isLoading}
              >
                <HelpCircle className="w-5 h-5" />
              </button>

              {isComplete && (
                <button
                  onClick={downloadPDF}
                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  title="Download PDF"
                >
                  <Download className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {Math.round(progress)}% Complete
            </p>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role !== 'user' && (
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'system' 
                    ? 'bg-gray-200' 
                    : 'bg-blue-100'
                }`}>
                  {message.role === 'system' ? (
                    message.validated ? <Check className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Bot className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              )}
              
              <div
                className={`max-w-2xl px-4 py-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.role === 'system'
                    ? 'bg-gray-100 text-gray-800 border border-gray-300'
                    : 'bg-white text-gray-900 shadow-md border'
                }`}
              >
                {message.role === 'user' ? (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                ) : (
                  <div
                    className="whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: formatAIResponse(message.content, true) }}
                  />
                )}
                <p className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              
              {message.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-blue-600" />
              </div>
              <div className="bg-white px-4 py-3 rounded-lg shadow-md border">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      {!isComplete && (
        <div className="bg-white border-t px-4 py-4">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your answer..."
                className="flex-1 px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
                dir={['ar', 'fa', 'ur'].includes(selectedLanguage) ? 'rtl' : 'ltr'}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Completion Actions */}
      {isComplete && showSummary && (
        <div className="bg-white border-t px-4 py-4">
          <div className="max-w-4xl mx-auto flex gap-3 justify-center">
            <button
              onClick={downloadPDF}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Download PDF
            </button>
            <button
              onClick={startForm}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              Start New Application
            </button>
          </div>
        </div>
      )}
    </div>
  );
}