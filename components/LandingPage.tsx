'use client';

import { Globe, MessageCircle, FileCheck, Shield, ChevronRight, Bot } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

interface LandingPageProps {
  onStartForm: () => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
}

export default function LandingPage({ onStartForm, selectedLanguage, setSelectedLanguage }: LandingPageProps) {

  const features = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Mehrsprachig',
      description: 'Fülle das Formular in deiner Muttersprache aus',
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'Chatbot-Unterstützung',
      description: 'Schritt-für-Schritt Anleitung durch unseren KI-Assistenten',
    },
    {
      icon: <FileCheck className="w-6 h-6" />,
      title: 'Automatische Prüfung',
      description: 'Vollständigkeit und Plausibilität werden automatisch geprüft',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Datenschutz',
      description: 'Deine Daten sind sicher und werden vertraulich behandelt',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">FormHelper</span>
            </div>
            <LanguageSelector 
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
            />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <Bot className="w-12 h-12 text-blue-600" />
              Arbeitserlaubnis Assistent
            </h1>
            <p className="text-xl text-gray-600 mb-3 max-w-3xl mx-auto">
              {getSubtitle(selectedLanguage)}
            </p>
            <p className="text-lg text-blue-600 font-semibold mb-8">
              🌍 Powered by Ollama AI - 20+ Languages Supported
            </p>
            
            {/* Video Placeholder */}
            <div className="bg-gray-200 rounded-lg max-w-4xl mx-auto mb-8 aspect-video flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-500">Demo Video - So einfach geht's!</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onStartForm}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                {getStartButtonText(selectedLanguage)}
                <ChevronRight className="w-5 h-5" />
              </button>
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors">
                {getInfoButtonText(selectedLanguage)}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Deine Vorteile auf einen Blick
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            So funktioniert's
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Sprache wählen</h3>
              <p className="text-gray-600">Wähle deine bevorzugte Sprache aus 20+ verfügbaren Optionen</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Fragen beantworten</h3>
              <p className="text-gray-600">Der Chatbot führt dich Schritt für Schritt durch das Formular</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">PDF erhalten</h3>
              <p className="text-gray-600">Lade das fertige deutsche PDF herunter oder sende es direkt</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function getSubtitle(language: string): string {
  const subtitles: { [key: string]: string } = {
    de: 'Schnell und einfach zum Arbeitserlaubnis-Antrag mit KI-Unterstützung',
    en: 'Quick and easy work permit application with AI support',
    tr: 'Yapay zeka desteğiyle hızlı ve kolay çalışma izni başvurusu',
    ar: 'طلب تصريح عمل سريع وسهل بدعم الذكاء الاصطناعي',
    pl: 'Szybki i łatwy wniosek o pozwolenie na pracę ze wsparciem AI',
    uk: 'Швидка та проста заявка на дозвіл на роботу з підтримкою ШІ',
    es: 'Solicitud de permiso de trabajo rápida y fácil con soporte de IA',
    fr: 'Demande de permis de travail rapide et facile avec support IA'
  };
  return subtitles[language] || subtitles['de'];
}

function getStartButtonText(language: string): string {
  const texts: { [key: string]: string } = {
    de: 'Formular starten',
    en: 'Start Form',
    tr: 'Formu Başlat',
    ar: 'بدء النموذج',
    pl: 'Rozpocznij formularz',
    uk: 'Почати форму',
    es: 'Iniciar formulario',
    fr: 'Commencer le formulaire'
  };
  return texts[language] || texts['de'];
}

function getInfoButtonText(language: string): string {
  const texts: { [key: string]: string } = {
    de: 'Mehr erfahren',
    en: 'Learn more',
    tr: 'Daha fazla bilgi',
    ar: 'اعرف أكثر',
    pl: 'Dowiedz się więcej',
    uk: 'Дізнатися більше',
    es: 'Saber más',
    fr: 'En savoir plus'
  };
  return texts[language] || texts['de'];
}