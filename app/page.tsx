'use client';

import { useRouter } from 'next/navigation';
import { FileText, Globe, Shield, Home, Briefcase, Heart, GraduationCap, ArrowRight, Bot, CheckCircle, Clock, Users } from 'lucide-react';
import { useLanguage } from '@/components/ClientLayout';

export default function LandingPage() {
  const router = useRouter();
  const { selectedLanguage } = useLanguage();

  const languages = [
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'uk', name: 'Українська', flag: '🇺🇦' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  const content = {
    de: {
      title: 'Formulare einfach ausfüllen',
      subtitle: 'KI-gestützte Unterstützung für deutsche Behördenformulare in Ihrer Sprache',
      description: 'Wählen Sie das gewünschte Formular aus und lassen Sie sich Schritt für Schritt in Ihrer Muttersprache durch den Prozess führen.',
      forms: 'Verfügbare Formulare',
      features: 'Unsere Vorteile',
      feature1Title: 'Mehrsprachige Unterstützung',
      feature1Desc: 'Füllen Sie Formulare in Ihrer bevorzugten Sprache aus',
      feature2Title: 'KI-Assistent',
      feature2Desc: 'Intelligente Hilfe bei jedem Schritt',
      feature3Title: 'Schnell & Einfach',
      feature3Desc: 'Sparen Sie Zeit mit geführter Eingabe',
      feature4Title: 'Sicher & Privat',
      feature4Desc: 'Ihre Daten bleiben geschützt',
      startNow: 'Jetzt starten',
      comingSoon: 'Demnächst verfügbar'
    },
    en: {
      title: 'Fill Forms Easily',
      subtitle: 'Assistance for German government forms in your language',
      description: 'Select the desired form and let us guide you step by step through the process in your native language.',
      forms: 'Available Forms',
      features: 'Our Benefits',
      feature1Title: 'Multilingual Support',
      feature1Desc: 'Fill out forms in your preferred language',
      feature2Title: 'AI Assistant',
      feature2Desc: 'Intelligent help at every step',
      feature3Title: 'Fast & Easy',
      feature3Desc: 'Save time with guided input',
      feature4Title: 'Secure & Private',
      feature4Desc: 'Your data remains protected',
      startNow: 'Start Now',
      comingSoon: 'Coming Soon'
    },
    tr: {
      title: 'Formları Kolayca Doldurun',
      subtitle: 'Alman devlet formları için kendi dilinizde AI destekli yardım',
      description: 'İstediğiniz formu seçin ve ana dilinizde adım adım süreç boyunca size rehberlik edelim.',
      forms: 'Mevcut Formlar',
      features: 'Avantajlarımız',
      feature1Title: 'Çok Dilli Destek',
      feature1Desc: 'Formları tercih ettiğiniz dilde doldurun',
      feature2Title: 'AI Asistan',
      feature2Desc: 'Her adımda akıllı yardım',
      feature3Title: 'Hızlı ve Kolay',
      feature3Desc: 'Yönlendirilmiş girişle zaman kazanın',
      feature4Title: 'Güvenli ve Özel',
      feature4Desc: 'Verileriniz korunur',
      startNow: 'Şimdi Başla',
      comingSoon: 'Yakında'
    },
    ar: {
      title: 'املأ النماذج بسهولة',
      subtitle: 'مساعدة مدعومة بالذكاء الاصطناعي للنماذج الحكومية الألمانية بلغتك',
      description: 'اختر النموذج المطلوب ودعنا نرشدك خطوة بخطوة خلال العملية بلغتك الأم.',
      forms: 'النماذج المتاحة',
      features: 'مزايانا',
      feature1Title: 'دعم متعدد اللغات',
      feature1Desc: 'املأ النماذج بلغتك المفضلة',
      feature2Title: 'مساعد الذكاء الاصطناعي',
      feature2Desc: 'مساعدة ذكية في كل خطوة',
      feature3Title: 'سريع وسهل',
      feature3Desc: 'وفر الوقت مع الإدخال الموجه',
      feature4Title: 'آمن وخاص',
      feature4Desc: 'بياناتك تبقى محمية',
      startNow: 'ابدأ الآن',
      comingSoon: 'قريباً'
    },
    pl: {
      title: 'Wypełniaj formularze łatwo',
      subtitle: 'Pomoc AI dla niemieckich formularzy rządowych w Twoim języku',
      description: 'Wybierz żądany formularz i pozwól nam poprowadzić Cię krok po kroku przez proces w Twoim ojczystym języku.',
      forms: 'Dostępne formularze',
      features: 'Nasze korzyści',
      feature1Title: 'Wsparcie wielojęzyczne',
      feature1Desc: 'Wypełniaj formularze w preferowanym języku',
      feature2Title: 'Asystent AI',
      feature2Desc: 'Inteligentna pomoc na każdym kroku',
      feature3Title: 'Szybko i łatwo',
      feature3Desc: 'Oszczędź czas dzięki prowadzonemu wprowadzaniu',
      feature4Title: 'Bezpieczne i prywatne',
      feature4Desc: 'Twoje dane pozostają chronione',
      startNow: 'Zacznij teraz',
      comingSoon: 'Wkrótce'
    },
    uk: {
      title: 'Заповнюйте форми легко',
      subtitle: 'AI-підтримка для німецьких державних форм вашою мовою',
      description: 'Виберіть потрібну форму і дозвольте нам провести вас крок за кроком через процес вашою рідною мовою.',
      forms: 'Доступні форми',
      features: 'Наші переваги',
      feature1Title: 'Багатомовна підтримка',
      feature1Desc: 'Заповнюйте форми вашою мовою',
      feature2Title: 'AI асистент',
      feature2Desc: 'Розумна допомога на кожному кроці',
      feature3Title: 'Швидко та легко',
      feature3Desc: 'Економте час з керованим введенням',
      feature4Title: 'Безпечно та приватно',
      feature4Desc: 'Ваші дані залишаються захищеними',
      startNow: 'Почати зараз',
      comingSoon: 'Незабаром'
    },
    es: {
      title: 'Rellene formularios fácilmente',
      subtitle: 'Asistencia con IA para formularios gubernamentales alemanes en su idioma',
      description: 'Seleccione el formulario deseado y déjenos guiarle paso a paso a través del proceso en su idioma nativo.',
      forms: 'Formularios disponibles',
      features: 'Nuestros beneficios',
      feature1Title: 'Soporte multilingüe',
      feature1Desc: 'Complete formularios en su idioma preferido',
      feature2Title: 'Asistente de IA',
      feature2Desc: 'Ayuda inteligente en cada paso',
      feature3Title: 'Rápido y fácil',
      feature3Desc: 'Ahorre tiempo con entrada guiada',
      feature4Title: 'Seguro y privado',
      feature4Desc: 'Sus datos permanecen protegidos',
      startNow: 'Empezar ahora',
      comingSoon: 'Próximamente'
    },
    fr: {
      title: 'Remplissez les formulaires facilement',
      subtitle: 'Assistance IA pour les formulaires gouvernementaux allemands dans votre langue',
      description: 'Sélectionnez le formulaire souhaité et laissez-nous vous guider étape par étape dans votre langue maternelle.',
      forms: 'Formulaires disponibles',
      features: 'Nos avantages',
      feature1Title: 'Support multilingue',
      feature1Desc: 'Remplissez les formulaires dans votre langue préférée',
      feature2Title: 'Assistant IA',
      feature2Desc: 'Aide intelligente à chaque étape',
      feature3Title: 'Rapide et facile',
      feature3Desc: 'Gagnez du temps avec une saisie guidée',
      feature4Title: 'Sécurisé et privé',
      feature4Desc: 'Vos données restent protégées',
      startNow: 'Commencer maintenant',
      comingSoon: 'Bientôt disponible'
    }
  };

  const getText = (key: keyof typeof content.de) => {
    return content[selectedLanguage as keyof typeof content]?.[key] || content.de[key];
  };

  const formCategories = [
    {
      id: 'work-permit',
      icon: Briefcase,
      title: {
        de: 'Arbeitserlaubnis',
        en: 'Work Permit',
        tr: 'Çalışma İzni',
        ar: 'تصريح العمل',
        pl: 'Pozwolenie na pracę',
        uk: 'Дозвіл на роботу',
        es: 'Permiso de trabajo',
        fr: 'Permis de travail'
      },
      description: {
        de: 'Antrag auf Arbeitserlaubnis für Deutschland',
        en: 'Application for work permit in Germany',
        tr: 'Almanya çalışma izni başvurusu',
        ar: 'طلب تصريح عمل في ألمانيا',
        pl: 'Wniosek o pozwolenie na pracę w Niemczech',
        uk: 'Заява на дозвіл на роботу в Німеччині',
        es: 'Solicitud de permiso de trabajo en Alemania',
        fr: 'Demande de permis de travail en Allemagne'
      },
      available: true,
      path: '/forms/work-permit'
    },
    {
      id: 'residence-permit',
      icon: Home,
      title: {
        de: 'Aufenthaltserlaubnis',
        en: 'Residence Permit',
        tr: 'Oturma İzni',
        ar: 'تصريح الإقامة',
        pl: 'Pozwolenie na pobyt',
        uk: 'Дозвіл на проживання',
        es: 'Permiso de residencia',
        fr: 'Permis de séjour'
      },
      description: {
        de: 'Antrag auf Aufenthaltserlaubnis',
        en: 'Application for residence permit',
        tr: 'Oturma izni başvurusu',
        ar: 'طلب تصريح الإقامة',
        pl: 'Wniosek o pozwolenie na pobyt',
        uk: 'Заява на дозвіл на проживання',
        es: 'Solicitud de permiso de residencia',
        fr: 'Demande de permis de séjour'
      },
      available: false,
      path: '/forms/residence-permit'
    },
    {
      id: 'family-reunion',
      icon: Heart,
      title: {
        de: 'Familienzusammenführung',
        en: 'Family Reunion',
        tr: 'Aile Birleşimi',
        ar: 'لم شمل الأسرة',
        pl: 'Łączenie rodzin',
        uk: 'Возз\'єднання сім\'ї',
        es: 'Reunificación familiar',
        fr: 'Regroupement familial'
      },
      description: {
        de: 'Antrag auf Familienzusammenführung',
        en: 'Application for family reunion',
        tr: 'Aile birleşimi başvurusu',
        ar: 'طلب لم شمل الأسرة',
        pl: 'Wniosek o łączenie rodzin',
        uk: 'Заява на возз\'єднання сім\'ї',
        es: 'Solicitud de reunificación familiar',
        fr: 'Demande de regroupement familial'
      },
      available: false,
      path: '/forms/family-reunion'
    },
    {
      id: 'student-visa',
      icon: GraduationCap,
      title: {
        de: 'Studentenvisum',
        en: 'Student Visa',
        tr: 'Öğrenci Vizesi',
        ar: 'تأشيرة الطالب',
        pl: 'Wiza studencka',
        uk: 'Студентська віза',
        es: 'Visa de estudiante',
        fr: 'Visa étudiant'
      },
      description: {
        de: 'Antrag auf Studentenvisum',
        en: 'Application for student visa',
        tr: 'Öğrenci vizesi başvurusu',
        ar: 'طلب تأشيرة الطالب',
        pl: 'Wniosek o wizę studencką',
        uk: 'Заява на студентську візу',
        es: 'Solicitud de visa de estudiante',
        fr: 'Demande de visa étudiant'
      },
      available: false,
      path: '/forms/student-visa'
    }
  ];

  const getFormText = (form: any, key: 'title' | 'description') => {
    return form[key][selectedLanguage as keyof typeof form.title] || form[key].de;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            {getText('title')}
          </h2>
          <p className="text-xl text-gray-600 mb-4">
            {getText('subtitle')}
          </p>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto">
            {getText('description')}
          </p>
        </div>
      </section>

      {/* Forms Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {getText('forms')}
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {formCategories.map((form) => {
            const Icon = form.icon;
            return (
              <div
                key={form.id}
                className={`bg-white rounded-xl shadow-lg p-6 transition-all ${
                  form.available 
                    ? 'hover:shadow-xl hover:scale-105 cursor-pointer' 
                    : 'opacity-60 cursor-not-allowed'
                }`}
                onClick={() => form.available && router.push(form.path)}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    form.available ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-8 h-8 ${
                      form.available ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      {getFormText(form, 'title')}
                    </h4>
                    <p className="text-gray-600 mb-4">
                      {getFormText(form, 'description')}
                    </p>
                    {form.available ? (
                      <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        {getText('startNow')}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-500 rounded-lg">
                        <Clock className="w-4 h-4" />
                        {getText('comingSoon')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          {getText('features')}
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              {getText('feature1Title')}
            </h4>
            <p className="text-gray-600 text-sm">
              {getText('feature1Desc')}
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              {getText('feature2Title')}
            </h4>
            <p className="text-gray-600 text-sm">
              {getText('feature2Desc')}
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              {getText('feature3Title')}
            </h4>
            <p className="text-gray-600 text-sm">
              {getText('feature3Desc')}
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-yellow-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              {getText('feature4Title')}
            </h4>
            <p className="text-gray-600 text-sm">
              {getText('feature4Desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 MIGStart AI - Powered by Ollama
          </p>
        </div>
      </footer>
    </div>
  );
}