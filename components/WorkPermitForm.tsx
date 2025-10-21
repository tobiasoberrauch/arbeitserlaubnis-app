'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Globe, HelpCircle, FileText, Check, Edit3, TestTube, Download, Printer } from 'lucide-react';
import ExportModal from './ExportModal';
import { formatAIResponse } from '@/lib/formatAIResponse';

interface WorkPermitFormProps {
  onComplete: (data: any) => void;
  selectedLanguage: string;
  onLanguageChange?: (lang: string) => void;
  setSelectedLanguage?: (lang: string) => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  fieldId?: string;
}

interface FormData {
  [key: string]: any;
}

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
  { code: 'ko', name: '한국어', flag: '🇰🇷' }
];

const formFieldTranslations: { [fieldId: string]: { [lang: string]: string } } = {
  fullName: {
    de: 'Vollständiger Name',
    en: 'Full Name',
    tr: 'Tam Ad',
    ar: 'الاسم الكامل',
    pl: 'Pełne imię i nazwisko',
    uk: 'Повне ім\'я',
    es: 'Nombre completo',
    fr: 'Nom complet'
  },
  dateOfBirth: {
    de: 'Geburtsdatum',
    en: 'Date of Birth',
    tr: 'Doğum Tarihi',
    ar: 'تاريخ الميلاد',
    pl: 'Data urodzenia',
    uk: 'Дата народження',
    es: 'Fecha de nacimiento',
    fr: 'Date de naissance'
  },
  nationality: {
    de: 'Staatsangehörigkeit',
    en: 'Nationality',
    tr: 'Uyruk',
    ar: 'الجنسية',
    pl: 'Narodowość',
    uk: 'Громадянство',
    es: 'Nacionalidad',
    fr: 'Nationalité'
  },
  passportNumber: {
    de: 'Reisepassnummer',
    en: 'Passport Number',
    tr: 'Pasaport Numarası',
    ar: 'رقم جواز السفر',
    pl: 'Numer paszportu',
    uk: 'Номер паспорта',
    es: 'Número de pasaporte',
    fr: 'Numéro de passeport'
  },
  currentAddress: {
    de: 'Aktuelle Adresse',
    en: 'Current Address',
    tr: 'Mevcut Adres',
    ar: 'العنوان الحالي',
    pl: 'Obecny adres',
    uk: 'Поточна адреса',
    es: 'Dirección actual',
    fr: 'Adresse actuelle'
  },
  phoneNumber: {
    de: 'Telefonnummer',
    en: 'Phone Number',
    tr: 'Telefon Numarası',
    ar: 'رقم الهاتف',
    pl: 'Numer telefonu',
    uk: 'Номер телефону',
    es: 'Número de teléfono',
    fr: 'Numéro de téléphone'
  },
  email: {
    de: 'E-Mail',
    en: 'Email',
    tr: 'E-posta',
    ar: 'البريد الإلكتروني',
    pl: 'E-mail',
    uk: 'Електронна пошта',
    es: 'Correo electrónico',
    fr: 'Courriel'
  },
  maritalStatus: {
    de: 'Familienstand',
    en: 'Marital Status',
    tr: 'Medeni Durum',
    ar: 'الحالة الاجتماعية',
    pl: 'Stan cywilny',
    uk: 'Сімейний стан',
    es: 'Estado civil',
    fr: 'État civil'
  },
  germanAddress: {
    de: 'Adresse in Deutschland',
    en: 'Address in Germany',
    tr: 'Almanya\'daki Adres',
    ar: 'العنوان في ألمانيا',
    pl: 'Adres w Niemczech',
    uk: 'Адреса в Німеччині',
    es: 'Dirección en Alemania',
    fr: 'Adresse en Allemagne'
  },
  plannedArrival: {
    de: 'Geplante Ankunft',
    en: 'Planned Arrival',
    tr: 'Planlanan Varış',
    ar: 'الوصول المخطط',
    pl: 'Planowany przyjazd',
    uk: 'Запланований приїзд',
    es: 'Llegada prevista',
    fr: 'Arrivée prévue'
  },
  employerName: {
    de: 'Arbeitgeber',
    en: 'Employer',
    tr: 'İşveren',
    ar: 'صاحب العمل',
    pl: 'Pracodawca',
    uk: 'Роботодавець',
    es: 'Empleador',
    fr: 'Employeur'
  },
  employerAddress: {
    de: 'Arbeitgeber Adresse',
    en: 'Employer Address',
    tr: 'İşveren Adresi',
    ar: 'عنوان صاحب العمل',
    pl: 'Adres pracodawcy',
    uk: 'Адреса роботодавця',
    es: 'Dirección del empleador',
    fr: 'Adresse de l\'employeur'
  },
  jobTitle: {
    de: 'Position',
    en: 'Position',
    tr: 'Pozisyon',
    ar: 'المنصب',
    pl: 'Stanowisko',
    uk: 'Посада',
    es: 'Puesto',
    fr: 'Poste'
  },
  jobDescription: {
    de: 'Tätigkeitsbeschreibung',
    en: 'Job Description',
    tr: 'İş Tanımı',
    ar: 'وصف الوظيفة',
    pl: 'Opis stanowiska',
    uk: 'Опис роботи',
    es: 'Descripción del trabajo',
    fr: 'Description du poste'
  },
  contractDuration: {
    de: 'Vertragsdauer',
    en: 'Contract Duration',
    tr: 'Sözleşme Süresi',
    ar: 'مدة العقد',
    pl: 'Czas trwania umowy',
    uk: 'Тривалість контракту',
    es: 'Duración del contrato',
    fr: 'Durée du contrat'
  },
  salary: {
    de: 'Monatsgehalt (EUR)',
    en: 'Monthly Salary (EUR)',
    tr: 'Aylık Maaş (EUR)',
    ar: 'الراتب الشهري (يورو)',
    pl: 'Wynagrodzenie miesięczne (EUR)',
    uk: 'Місячна зарплата (EUR)',
    es: 'Salario mensual (EUR)',
    fr: 'Salaire mensuel (EUR)'
  },
  workHours: {
    de: 'Arbeitsstunden/Woche',
    en: 'Work Hours/Week',
    tr: 'Çalışma Saatleri/Hafta',
    ar: 'ساعات العمل/الأسبوع',
    pl: 'Godziny pracy/tydzień',
    uk: 'Робочі години/тиждень',
    es: 'Horas de trabajo/semana',
    fr: 'Heures de travail/semaine'
  },
  previousEmployment: {
    de: 'Berufserfahrung',
    en: 'Work Experience',
    tr: 'İş Deneyimi',
    ar: 'الخبرة المهنية',
    pl: 'Doświadczenie zawodowe',
    uk: 'Досвід роботи',
    es: 'Experiencia laboral',
    fr: 'Expérience professionnelle'
  },
  qualifications: {
    de: 'Qualifikationen',
    en: 'Qualifications',
    tr: 'Nitelikler',
    ar: 'المؤهلات',
    pl: 'Kwalifikacje',
    uk: 'Кваліфікації',
    es: 'Cualificaciones',
    fr: 'Qualifications'
  },
  germanLevel: {
    de: 'Deutschkenntnisse',
    en: 'German Language Skills',
    tr: 'Almanca Dil Becerileri',
    ar: 'مهارات اللغة الألمانية',
    pl: 'Znajomość języka niemieckiego',
    uk: 'Знання німецької мови',
    es: 'Conocimientos de alemán',
    fr: 'Compétences en allemand'
  },
  criminalRecord: {
    de: 'Vorstrafen',
    en: 'Criminal Record',
    tr: 'Sabıka Kaydı',
    ar: 'السجل الجنائي',
    pl: 'Karalność',
    uk: 'Судимість',
    es: 'Antecedentes penales',
    fr: 'Casier judiciaire'
  },
  healthInsurance: {
    de: 'Krankenversicherung',
    en: 'Health Insurance',
    tr: 'Sağlık Sigortası',
    ar: 'التأمين الصحي',
    pl: 'Ubezpieczenie zdrowotne',
    uk: 'Медичне страхування',
    es: 'Seguro de salud',
    fr: 'Assurance maladie'
  },
  accommodation: {
    de: 'Unterkunft',
    en: 'Accommodation',
    tr: 'Konaklama',
    ar: 'السكن',
    pl: 'Zakwaterowanie',
    uk: 'Житло',
    es: 'Alojamiento',
    fr: 'Logement'
  },
  financialSupport: {
    de: 'Finanzierung',
    en: 'Financial Support',
    tr: 'Mali Destek',
    ar: 'الدعم المالي',
    pl: 'Wsparcie finansowe',
    uk: 'Фінансова підтримка',
    es: 'Apoyo financiero',
    fr: 'Soutien financier'
  }
};

const formFields = [
  { id: 'fullName', type: 'text', required: true },
  { id: 'dateOfBirth', type: 'date', required: true },
  { id: 'nationality', type: 'select', required: true },
  { id: 'passportNumber', type: 'text', required: true },
  { id: 'currentAddress', type: 'text', required: true },
  { id: 'phoneNumber', type: 'tel', required: true },
  { id: 'email', type: 'email', required: true },
  { id: 'maritalStatus', type: 'select', required: true },
  { id: 'germanAddress', type: 'text', required: false },
  { id: 'plannedArrival', type: 'date', required: true },
  { id: 'employerName', type: 'text', required: true },
  { id: 'employerAddress', type: 'text', required: true },
  { id: 'jobTitle', type: 'text', required: true },
  { id: 'jobDescription', type: 'textarea', required: true },
  { id: 'contractDuration', type: 'text', required: true },
  { id: 'salary', type: 'number', required: true },
  { id: 'workHours', type: 'number', required: true },
  { id: 'previousEmployment', type: 'textarea', required: false },
  { id: 'qualifications', type: 'textarea', required: true },
  { id: 'germanLevel', type: 'select', required: true },
  { id: 'criminalRecord', type: 'select', required: true },
  { id: 'healthInsurance', type: 'text', required: true },
  { id: 'accommodation', type: 'text', required: false },
  { id: 'financialSupport', type: 'text', required: true }
];

export default function WorkPermitForm({ 
  onComplete, 
  selectedLanguage, 
  onLanguageChange,
  setSelectedLanguage 
}: WorkPermitFormProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
  const [currentFieldId, setCurrentFieldId] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [lastAskedField, setLastAskedField] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevLanguageRef = useRef(selectedLanguage);

  const totalSteps = formFields.length;
  const filledFields = Object.keys(formData).filter(key => formData[key]).length;
  const progress = ((filledFields / totalSteps) * 100);

  // Format name to Title Case (capitalize first letter of each word)
  const formatNameToTitleCase = (name: string): string => {
    return name
      .toLowerCase()
      .split(' ')
      .map(word => {
        if (word.length === 0) return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  };

  // Parse date from various formats to YYYY-MM-DD
  const parseDate = (dateStr: string): string | null => {
    if (!dateStr) return null;

    // Already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }

    // DD.MM.YYYY format (German)
    const germanMatch = dateStr.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
    if (germanMatch) {
      const [, day, month, year] = germanMatch;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    // DD/MM/YYYY or MM/DD/YYYY
    const slashMatch = dateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (slashMatch) {
      const [, first, second, year] = slashMatch;
      // Assume DD/MM/YYYY for European format
      return `${year}-${second.padStart(2, '0')}-${first.padStart(2, '0')}`;
    }

    // Try to extract year, month, day from text
    const textMatch = dateStr.match(/(\d{1,2})[.\s]+(\w+)[.\s]+(\d{4})/);
    if (textMatch) {
      const [, day, monthName, year] = textMatch;
      const months: { [key: string]: string } = {
        'januar': '01', 'january': '01', 'jan': '01',
        'februar': '02', 'february': '02', 'feb': '02',
        'märz': '03', 'march': '03', 'mar': '03',
        'april': '04', 'apr': '04',
        'mai': '05', 'may': '05',
        'juni': '06', 'june': '06', 'jun': '06',
        'juli': '07', 'july': '07', 'jul': '07',
        'august': '08', 'aug': '08',
        'september': '09', 'sep': '09', 'sept': '09',
        'oktober': '10', 'october': '10', 'oct': '10', 'okt': '10',
        'november': '11', 'nov': '11',
        'dezember': '12', 'december': '12', 'dec': '12', 'dez': '12'
      };
      const month = months[monthName.toLowerCase()];
      if (month) {
        return `${year}-${month}-${day.padStart(2, '0')}`;
      }
    }

    return null;
  };

  // Normalize dropdown values
  const normalizeDropdownValue = (fieldId: string, value: string): string => {
    if (!value) return value;

    const normalized = value.toLowerCase().trim();

    // Nationality mapping - maps to country codes (TR, SY, PL, UA, etc.)
    if (fieldId === 'nationality') {
      console.log('🔍 Nationality input:', value, '| normalized:', normalized);
      const nationalityMap: { [key: string]: string } = {
        // German
        'deutsch': 'DE', 'german': 'DE', 'germany': 'DE', 'deutschland': 'DE',
        // Turkish
        'türkisch': 'TR', 'turkish': 'TR', 'türkei': 'TR', 'turkey': 'TR', 'türkiye': 'TR',
        // Syrian
        'syrisch': 'SY', 'syrian': 'SY', 'syrien': 'SY', 'syria': 'SY', 'suriye': 'SY',
        // Polish
        'polnisch': 'PL', 'polish': 'PL', 'polen': 'PL', 'poland': 'PL', 'polska': 'PL',
        // Ukrainian
        'ukrainisch': 'UA', 'ukrainian': 'UA', 'ukraine': 'UA', 'україна': 'UA',
        // Indian
        'indisch': 'IN', 'indian': 'IN', 'indien': 'IN', 'india': 'IN',
        // Russian
        'russisch': 'RU', 'russian': 'RU', 'russland': 'RU', 'russia': 'RU', 'россия': 'RU',
        // Chinese
        'chinesisch': 'CN', 'chinese': 'CN', 'china': 'CN', '中国': 'CN',
        // American/USA
        'amerikanisch': 'US', 'american': 'US', 'usa': 'US', 'united states': 'US',
        // Spanish
        'spanisch': 'ES', 'spanish': 'ES', 'spanien': 'ES', 'spain': 'ES',
        // French
        'französisch': 'FR', 'french': 'FR', 'frankreich': 'FR', 'france': 'FR',
        // Italian
        'italienisch': 'IT', 'italian': 'IT', 'italien': 'IT', 'italy': 'IT',
        // Portuguese
        'portugiesisch': 'PT', 'portuguese': 'PT', 'portugal': 'PT',
        // Other common countries
        'british': 'GB', 'uk': 'GB', 'united kingdom': 'GB', 'großbritannien': 'GB',
        'romanian': 'RO', 'rumänisch': 'RO', 'romania': 'RO', 'rumänien': 'RO',
        'bulgarian': 'BG', 'bulgarisch': 'BG', 'bulgaria': 'BG', 'bulgarien': 'BG',
        'greek': 'GR', 'griechisch': 'GR', 'greece': 'GR', 'griechenland': 'GR',
        // Fallback for "other"
        'andere': 'OTHER', 'other': 'OTHER', 'sonstige': 'OTHER'
      };
      const result = nationalityMap[normalized] || value;
      console.log('✅ Nationality mapped to:', result);
      return result;
    }

    // Marital status mapping
    if (fieldId === 'maritalStatus') {
      const maritalMap: { [key: string]: string } = {
        'ledig': 'single', 'unverheiratet': 'single', 'single': 'single',
        'verheiratet': 'married', 'married': 'married',
        'geschieden': 'divorced', 'divorced': 'divorced',
        'verwitwet': 'widowed', 'widowed': 'widowed'
      };
      return maritalMap[normalized] || value;
    }

    // German level mapping - maps to uppercase levels (A1, A2, B1, B2, C1, C2)
    if (fieldId === 'germanLevel') {
      const levelMap: { [key: string]: string } = {
        'keine': 'none', 'no': 'none', 'none': 'none', 'kein': 'none',
        'a1': 'A1', 'anfänger': 'A1', 'beginner': 'A1',
        'a2': 'A2', 'grundkenntnisse': 'A2', 'elementary': 'A2',
        'b1': 'B1', 'mittelstufe': 'B1', 'intermediate': 'B1',
        'b2': 'B2', 'gute mittelstufe': 'B2', 'upper intermediate': 'B2',
        'c1': 'C1', 'fortgeschritten': 'C1', 'advanced': 'C1',
        'c2': 'C2', 'exzellent': 'C2', 'fließend': 'C2', 'fluent': 'C2', 'proficient': 'C2'
      };
      return levelMap[normalized] || value;
    }

    // Yes/No mapping
    if (fieldId === 'criminalRecord') {
      const yesNoMap: { [key: string]: string } = {
        'ja': 'yes', 'yes': 'yes',
        'nein': 'no', 'no': 'no'
      };
      return yesNoMap[normalized] || value;
    }

    return value;
  };

  // Initialize only once
  useEffect(() => {
    if (!isInitialized) {
      startForm();
      setIsInitialized(true);
    }
  }, []);

  // Keyboard shortcut for demo data (Ctrl+D or Cmd+D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        fillDemoData();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLanguage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle language change - translate both messages and form values
  useEffect(() => {
    if (prevLanguageRef.current !== selectedLanguage && isInitialized) {
      translateMessages();
      translateFormValues(prevLanguageRef.current, selectedLanguage);
      prevLanguageRef.current = selectedLanguage;
    }
  }, [selectedLanguage, isInitialized]);

  const translateMessages = () => {
    // Keep user messages, translate bot messages
    const translatedMessages = messages.map(msg => {
      if (msg.role === 'user') return msg;
      
      if (msg.role === 'assistant') {
        if (msg.fieldId) {
          return {
            ...msg,
            content: getFieldQuestion(msg.fieldId)
          };
        } else {
          // Welcome message
          return {
            ...msg,
            content: getWelcomeMessage()
          };
        }
      }
      
      if (msg.role === 'system') {
        return {
          ...msg,
          content: msg.content.includes('✅') ? `✅ ${getConfirmationMessage()}` : msg.content
        };
      }
      
      return msg;
    });
    
    setMessages(translatedMessages);
  };

  const translateFormValues = async (fromLang: string, toLang: string) => {
    // Skip if no data to translate or same language
    if (Object.keys(formData).length === 0 || fromLang === toLang) return;

    setIsTranslating(true);
    
    // Show translation message
    const translatingMessage: Message = {
      id: Date.now().toString(),
      role: 'system',
      content: toLang === 'de' 
        ? '🔄 Übersetze Formulardaten...' 
        : '🔄 Translating form data...',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, translatingMessage]);

    try {
      const response = await fetch('/api/chat/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'translate',
          values: formData,
          fromLanguage: fromLang,
          toLanguage: toLang
        })
      });

      if (response.ok) {
        const { translatedValues } = await response.json();
        setFormData(translatedValues);
        
        // Remove translating message and add success message
        setMessages(prev => {
          const filtered = prev.filter(msg => msg.id !== translatingMessage.id);
          const successMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'system',
            content: toLang === 'de'
              ? '✅ Formulardaten wurden übersetzt!'
              : '✅ Form data has been translated!',
            timestamp: new Date()
          };
          return [...filtered, successMessage];
        });
      } else {
        throw new Error('Translation failed');
      }
    } catch (error) {
      console.error('Translation error:', error);
      
      // Remove translating message and show error
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== translatingMessage.id);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'system',
          content: toLang === 'de'
            ? '⚠️ Übersetzung fehlgeschlagen. Formulardaten bleiben unverändert.'
            : '⚠️ Translation failed. Form data remains unchanged.',
          timestamp: new Date()
        };
        return [...filtered, errorMessage];
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startForm = async () => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: getWelcomeMessage(),
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);

    askNextQuestion();
  };

  const getWelcomeMessage = () => {
    const messages: { [key: string]: string } = {
      de: '👋 Willkommen! Ich helfe Ihnen beim Ausfüllen des Arbeitserlaubnis-Antrags.\n\nSie können die Fragen im Chat beantworten oder direkt im Formular rechts eingeben.',
      en: '👋 Welcome! I will help you fill out the work permit application.\n\nYou can answer questions in the chat or enter directly in the form on the right.',
      tr: '👋 Hoş geldiniz! Çalışma izni başvurusunu doldurmanıza yardımcı olacağım.\n\nSoruları sohbette cevaplayabilir veya sağdaki forma doğrudan girebilirsiniz.',
      ar: '👋 مرحباً! سأساعدك في ملء طلب تصريح العمل.\n\nيمكنك الإجابة على الأسئلة في الدردشة أو الإدخال مباشرة في النموذج على اليمين.',
      pl: '👋 Witamy! Pomogę Ci wypełnić wniosek o pozwolenie na pracę.\n\nMożesz odpowiadać na pytania w czacie lub wprowadzać bezpośrednio w formularzu po prawej.',
      uk: '👋 Ласкаво просимо! Я допоможу вам заповнити заявку на дозвіл на роботу.\n\nВи можете відповідати на питання в чаті або вводити безпосередньо у формі праворуч.',
      es: '👋 ¡Bienvenido! Te ayudaré a completar la solicitud de permiso de trabajo.\n\nPuedes responder las preguntas en el chat o ingresar directamente en el formulario a la derecha.',
      fr: '👋 Bienvenue! Je vais vous aider à remplir la demande de permis de travail.\n\nVous pouvez répondre aux questions dans le chat ou saisir directement dans le formulaire à droite.'
    };
    return messages[selectedLanguage] || messages['de'];
  };

  const askNextQuestion = async (startIndex?: number, dataOverride?: FormData) => {
    let nextStep = typeof startIndex === 'number' ? startIndex : currentStep;
    const values = dataOverride ?? formData;
    while (nextStep < totalSteps && values[formFields[nextStep].id]) {
      nextStep++;
    }

    if (nextStep >= totalSteps) {
      // Show completion message
      const completionMessages: { [key: string]: string } = {
        de: '🎉 **Glückwunsch!** Ihr Arbeitserlaubnis-Antrag ist vollständig ausgefüllt.\n\n✅ Alle 24 Felder sind komplett!\n\n📄 Sie können Ihr Formular jetzt:\n• Als **PDF drucken** (Drucken-Button oben rechts)\n• Als **PDF, Word, Excel oder JSON exportieren** (Export-Button oben rechts)\n\nIhr Antrag ist bereit zur Einreichung! 🚀',
        en: '🎉 **Congratulations!** Your work permit application is complete.\n\n✅ All 24 fields are filled!\n\n📄 You can now:\n• **Print as PDF** (Print button top right)\n• **Export as PDF, Word, Excel or JSON** (Export button top right)\n\nYour application is ready for submission! 🚀',
        tr: '🎉 **Tebrikler!** Çalışma izni başvurunuz tamamlandı.\n\n✅ 24 alanın tümü dolduruldu!\n\n📄 Şimdi yapabilirsiniz:\n• **PDF olarak yazdır** (Sağ üstteki yazdır butonu)\n• **PDF, Word, Excel veya JSON olarak dışa aktar** (Sağ üstteki dışa aktar butonu)\n\nBaşvurunuz gönderime hazır! 🚀',
        ar: '🎉 **تهانينا!** طلب تصريح العمل الخاص بك مكتمل.\n\n✅ تم ملء جميع الحقول الـ 24!\n\n📄 يمكنك الآن:\n• **طباعة كملف PDF** (زر الطباعة أعلى اليمين)\n• **تصدير كملف PDF أو Word أو Excel أو JSON** (زر التصدير أعلى اليمين)\n\nطلبك جاهز للتقديم! 🚀',
        pl: '🎉 **Gratulacje!** Twój wniosek o pozwolenie na pracę jest kompletny.\n\n✅ Wszystkie 24 pola są wypełnione!\n\n📄 Możesz teraz:\n• **Wydrukować jako PDF** (Przycisk drukuj w prawym górnym rogu)\n• **Eksportować jako PDF, Word, Excel lub JSON** (Przycisk eksport w prawym górnym rogu)\n\nTwój wniosek jest gotowy do złożenia! 🚀',
        uk: '🎉 **Вітаємо!** Ваша заявка на дозвіл на роботу заповнена.\n\n✅ Усі 24 поля заповнені!\n\n📄 Ви можете зараз:\n• **Роздрукувати як PDF** (Кнопка друку вгорі праворуч)\n• **Експортувати як PDF, Word, Excel або JSON** (Кнопка експорту вгорі праворуч)\n\nВаша заявка готова до подання! 🚀',
        es: '🎉 **¡Felicitaciones!** Tu solicitud de permiso de trabajo está completa.\n\n✅ ¡Los 24 campos están llenos!\n\n📄 Ahora puedes:\n• **Imprimir como PDF** (Botón Imprimir arriba a la derecha)\n• **Exportar como PDF, Word, Excel o JSON** (Botón Exportar arriba a la derecha)\n\n¡Tu solicitud está lista para enviar! 🚀',
        fr: '🎉 **Félicitations!** Votre demande de permis de travail est complète.\n\n✅ Les 24 champs sont remplis!\n\n📄 Vous pouvez maintenant:\n• **Imprimer en PDF** (Bouton Imprimer en haut à droite)\n• **Exporter en PDF, Word, Excel ou JSON** (Bouton Exporter en haut à droite)\n\nVotre demande est prête à être soumise! 🚀'
      };

      const completionMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: completionMessages[selectedLanguage] || completionMessages['de'],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, completionMessage]);
      setIsLoading(false);

      // Call onComplete after showing the message
      setTimeout(() => {
        onComplete(values);
      }, 100);
      return;
    }

    const field = formFields[nextStep];
    
    // Prevent duplicate questions
    if (isLoading || lastAskedField === field.id) {
      return;
    }

    setCurrentStep(nextStep);
    setIsLoading(true);
    setCurrentFieldId(field.id);
    setLastAskedField(field.id);

    // Generate unique ID for this question to prevent duplicates
    const questionId = `${field.id}-${Date.now()}`;

    try {
      const context = {
        language: selectedLanguage,
        currentStep: nextStep,
        totalSteps,
        fields: Object.entries(values).map(([id, value]) => ({
          id,
          value,
          validated: true
        })),
        userInfo: values
      };

      const response = await fetch('/api/chat/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'nextQuestion',
          context
        })
      });

      if (response.ok) {
        const data = await response.json();
        const questionMessage: Message = {
          id: questionId,
          role: 'assistant',
          content: data.question,
          fieldId: field.id,
          timestamp: new Date()
        };
        
        // Check if this question was already added (prevent duplicates)
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.fieldId === field.id && lastMessage.role === 'assistant') {
            return prev; // Don't add duplicate
          }
          return [...prev, questionMessage];
        });
      } else {
        throw new Error('API request failed');
      }
    } catch (error) {
      // Fallback question if Ollama fails
      const questionMessage: Message = {
        id: questionId,
        role: 'assistant',
        content: getFieldQuestion(field.id),
        fieldId: field.id,
        timestamp: new Date()
      };
      
      // Check if this question was already added (prevent duplicates)
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.fieldId === field.id && lastMessage.role === 'assistant') {
          return prev; // Don't add duplicate
        }
        return [...prev, questionMessage];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldQuestion = (fieldId: string) => {
    const questions: { [key: string]: { [lang: string]: string } } = {
      fullName: {
        de: 'Wie lautet Ihr vollständiger Name (wie im Reisepass)?',
        en: 'What is your full name (as in passport)?',
        tr: 'Tam adınız nedir (pasaporttaki gibi)?',
        ar: 'ما هو اسمك الكامل (كما في جواز السفر)؟',
        pl: 'Jakie jest Twoje pełne imię i nazwisko (jak w paszporcie)?',
        uk: 'Яке ваше повне ім\'я (як у паспорті)?',
        es: '¿Cuál es su nombre completo (como en el pasaporte)?',
        fr: 'Quel est votre nom complet (comme dans le passeport)?'
      },
      dateOfBirth: {
        de: 'Wann wurden Sie geboren? (TT.MM.JJJJ)',
        en: 'When were you born? (DD.MM.YYYY)',
        tr: 'Doğum tarihiniz nedir? (GG.AA.YYYY)',
        ar: 'ما هو تاريخ ميلادك؟',
        pl: 'Kiedy się urodziłeś? (DD.MM.RRRR)',
        uk: 'Коли ви народилися? (ДД.ММ.РРРР)',
        es: '¿Cuándo nació? (DD.MM.AAAA)',
        fr: 'Quand êtes-vous né? (JJ.MM.AAAA)'
      },
      nationality: {
        de: 'Welche Staatsangehörigkeit haben Sie?',
        en: 'What is your nationality?',
        tr: 'Uyruğunuz nedir?',
        ar: 'ما هي جنسيتك؟',
        pl: 'Jaką masz narodowość?',
        uk: 'Яке ваше громадянство?',
        es: '¿Cuál es su nacionalidad?',
        fr: 'Quelle est votre nationalité?'
      },
      passportNumber: {
        de: 'Wie lautet Ihre Reisepassnummer?',
        en: 'What is your passport number?',
        tr: 'Pasaport numaranız nedir?',
        ar: 'ما هو رقم جواز سفرك؟',
        pl: 'Jaki jest numer Twojego paszportu?',
        uk: 'Який номер вашого паспорта?',
        es: '¿Cuál es su número de pasaporte?',
        fr: 'Quel est votre numéro de passeport?'
      },
      currentAddress: {
        de: 'Wie lautet Ihre aktuelle Adresse?',
        en: 'What is your current address?',
        tr: 'Mevcut adresiniz nedir?',
        ar: 'ما هو عنوانك الحالي؟',
        pl: 'Jaki jest Twój obecny adres?',
        uk: 'Яка ваша поточна адреса?',
        es: '¿Cuál es su dirección actual?',
        fr: 'Quelle est votre adresse actuelle?'
      },
      phoneNumber: {
        de: 'Wie lautet Ihre Telefonnummer (mit Ländervorwahl)?',
        en: 'What is your phone number (with country code)?',
        tr: 'Telefon numaranız nedir (ülke koduyla)?',
        ar: 'ما هو رقم هاتفك (مع رمز البلد)؟',
        pl: 'Jaki jest Twój numer telefonu (z kodem kraju)?',
        uk: 'Який ваш номер телефону (з кодом країни)?',
        es: '¿Cuál es su número de teléfono (con código de país)?',
        fr: 'Quel est votre numéro de téléphone (avec indicatif pays)?'
      },
      email: {
        de: 'Wie lautet Ihre E-Mail-Adresse?',
        en: 'What is your email address?',
        tr: 'E-posta adresiniz nedir?',
        ar: 'ما هو عنوان بريدك الإلكتروني؟',
        pl: 'Jaki jest Twój adres e-mail?',
        uk: 'Яка ваша електронна адреса?',
        es: '¿Cuál es su dirección de correo electrónico?',
        fr: 'Quelle est votre adresse e-mail?'
      },
      maritalStatus: {
        de: 'Wie ist Ihr Familienstand? (ledig/verheiratet/geschieden/verwitwet)',
        en: 'What is your marital status? (single/married/divorced/widowed)',
        tr: 'Medeni durumunuz nedir? (bekar/evli/boşanmış/dul)',
        ar: 'ما هي حالتك الاجتماعية؟',
        pl: 'Jaki jest Twój stan cywilny? (kawaler/panna/żonaty/zamężna/rozwiedziony/rozwiedziona/wdowiec/wdowa)',
        uk: 'Який ваш сімейний стан? (неодружений/незаміжня/одружений/заміжня/розлучений/розлучена/вдівець/вдова)',
        es: '¿Cuál es su estado civil? (soltero/casado/divorciado/viudo)',
        fr: 'Quel est votre état civil? (célibataire/marié/divorcé/veuf)'
      },
      germanAddress: {
        de: 'Wie lautet Ihre geplante Adresse in Deutschland?',
        en: 'What is your planned address in Germany?',
        tr: 'Almanya\'daki planlanan adresiniz nedir?',
        ar: 'ما هو عنوانك المخطط في ألمانيا؟',
        pl: 'Jaki jest Twój planowany adres w Niemczech?',
        uk: 'Яка ваша запланована адреса в Німеччині?',
        es: '¿Cuál es su dirección prevista en Alemania?',
        fr: 'Quelle est votre adresse prévue en Allemagne?'
      },
      plannedArrival: {
        de: 'Wann planen Sie nach Deutschland zu kommen?',
        en: 'When do you plan to come to Germany?',
        tr: 'Almanya\'ya ne zaman gelmeyi planlıyorsunuz?',
        ar: 'متى تخطط للقدوم إلى ألمانيا؟',
        pl: 'Kiedy planujesz przyjechać do Niemiec?',
        uk: 'Коли ви плануєте приїхати до Німеччини?',
        es: '¿Cuándo planea venir a Alemania?',
        fr: 'Quand prévoyez-vous de venir en Allemagne?'
      },
      employerName: {
        de: 'Wie heißt Ihr Arbeitgeber in Deutschland?',
        en: 'What is your employer\'s name in Germany?',
        tr: 'Almanya\'daki işvereninizin adı nedir?',
        ar: 'ما هو اسم صاحب العمل في ألمانيا؟',
        pl: 'Jak nazywa się Twój pracodawca w Niemczech?',
        uk: 'Як називається ваш роботодавець у Німеччині?',
        es: '¿Cuál es el nombre de su empleador en Alemania?',
        fr: 'Quel est le nom de votre employeur en Allemagne?'
      },
      employerAddress: {
        de: 'Wie lautet die Adresse Ihres Arbeitgebers?',
        en: 'What is your employer\'s address?',
        tr: 'İşvereninizin adresi nedir?',
        ar: 'ما هو عنوان صاحب العمل؟',
        pl: 'Jaki jest adres Twojego pracodawcy?',
        uk: 'Яка адреса вашого роботодавця?',
        es: '¿Cuál es la dirección de su empleador?',
        fr: 'Quelle est l\'adresse de votre employeur?'
      },
      jobTitle: {
        de: 'Welche Position werden Sie haben?',
        en: 'What position will you have?',
        tr: 'Hangi pozisyonda çalışacaksınız?',
        ar: 'ما هو المنصب الذي ستشغله؟',
        pl: 'Jakie stanowisko będziesz zajmować?',
        uk: 'Яку посаду ви займатимете?',
        es: '¿Qué puesto ocupará?',
        fr: 'Quel poste occuperez-vous?'
      },
      jobDescription: {
        de: 'Beschreiben Sie kurz Ihre geplanten Tätigkeiten.',
        en: 'Briefly describe your planned activities.',
        tr: 'Planlanan faaliyetlerinizi kısaca açıklayın.',
        ar: 'صف بإيجاز أنشطتك المخططة.',
        pl: 'Krótko opisz planowane czynności.',
        uk: 'Коротко опишіть заплановану діяльність.',
        es: 'Describa brevemente sus actividades previstas.',
        fr: 'Décrivez brièvement vos activités prévues.'
      },
      contractDuration: {
        de: 'Wie lange ist Ihr Arbeitsvertrag? (unbefristet oder Datum)',
        en: 'How long is your employment contract? (permanent or date)',
        tr: 'İş sözleşmeniz ne kadar süreli? (süresiz veya tarih)',
        ar: 'ما هي مدة عقد العمل؟',
        pl: 'Jak długa jest Twoja umowa o pracę? (na czas nieokreślony lub data)',
        uk: 'Яка тривалість вашого трудового договору? (безстроковий або дата)',
        es: '¿Cuánto dura su contrato de trabajo? (permanente o fecha)',
        fr: 'Quelle est la durée de votre contrat de travail? (permanent ou date)'
      },
      salary: {
        de: 'Wie hoch ist Ihr monatliches Bruttogehalt in EUR?',
        en: 'What is your monthly gross salary in EUR?',
        tr: 'Aylık brüt maaşınız kaç EUR?',
        ar: 'ما هو راتبك الشهري الإجمالي باليورو؟',
        pl: 'Jakie jest Twoje miesięczne wynagrodzenie brutto w EUR?',
        uk: 'Яка ваша місячна валова зарплата в EUR?',
        es: '¿Cuál es su salario bruto mensual en EUR?',
        fr: 'Quel est votre salaire brut mensuel en EUR?'
      },
      workHours: {
        de: 'Wie viele Stunden werden Sie pro Woche arbeiten?',
        en: 'How many hours will you work per week?',
        tr: 'Haftada kaç saat çalışacaksınız?',
        ar: 'كم ساعة ستعمل في الأسبوع؟',
        pl: 'Ile godzin będziesz pracować w tygodniu?',
        uk: 'Скільки годин на тиждень ви працюватимете?',
        es: '¿Cuántas horas trabajará por semana?',
        fr: 'Combien d\'heures travaillerez-vous par semaine?'
      },
      previousEmployment: {
        de: 'Beschreiben Sie Ihre Berufserfahrung der letzten 3 Jahre.',
        en: 'Describe your work experience from the last 3 years.',
        tr: 'Son 3 yıldaki iş deneyiminizi açıklayın.',
        ar: 'صف خبرتك المهنية في السنوات الثلاث الماضية.',
        pl: 'Opisz swoje doświadczenie zawodowe z ostatnich 3 lat.',
        uk: 'Опишіть свій досвід роботи за останні 3 роки.',
        es: 'Describa su experiencia laboral de los últimos 3 años.',
        fr: 'Décrivez votre expérience professionnelle des 3 dernières années.'
      },
      qualifications: {
        de: 'Welche Qualifikationen und Ausbildung haben Sie?',
        en: 'What qualifications and education do you have?',
        tr: 'Hangi niteliklere ve eğitime sahipsiniz?',
        ar: 'ما هي مؤهلاتك وتعليمك؟',
        pl: 'Jakie masz kwalifikacje i wykształcenie?',
        uk: 'Які у вас кваліфікації та освіта?',
        es: '¿Qué cualificaciones y educación tiene?',
        fr: 'Quelles sont vos qualifications et votre formation?'
      },
      germanLevel: {
        de: 'Wie gut sind Ihre Deutschkenntnisse? (Keine/A1/A2/B1/B2/C1/C2)',
        en: 'What is your German language level? (None/A1/A2/B1/B2/C1/C2)',
        tr: 'Almanca seviyeniz nedir? (Yok/A1/A2/B1/B2/C1/C2)',
        ar: 'ما هو مستوى لغتك الألمانية؟',
        pl: 'Jaki jest Twój poziom języka niemieckiego? (Brak/A1/A2/B1/B2/C1/C2)',
        uk: 'Який ваш рівень німецької мови? (Немає/A1/A2/B1/B2/C1/C2)',
        es: '¿Cuál es su nivel de alemán? (Ninguno/A1/A2/B1/B2/C1/C2)',
        fr: 'Quel est votre niveau d\'allemand? (Aucun/A1/A2/B1/B2/C1/C2)'
      },
      criminalRecord: {
        de: 'Haben Sie Vorstrafen? (Ja/Nein)',
        en: 'Do you have a criminal record? (Yes/No)',
        tr: 'Sabıka kaydınız var mı? (Evet/Hayır)',
        ar: 'هل لديك سجل جنائي؟ (نعم/لا)',
        pl: 'Czy byłeś karany? (Tak/Nie)',
        uk: 'Чи маєте ви судимість? (Так/Ні)',
        es: '¿Tiene antecedentes penales? (Sí/No)',
        fr: 'Avez-vous un casier judiciaire? (Oui/Non)'
      },
      healthInsurance: {
        de: 'Wie werden Sie krankenversichert sein?',
        en: 'How will you be health insured?',
        tr: 'Sağlık sigortanız nasıl olacak?',
        ar: 'كيف ستكون مؤمناً صحياً؟',
        pl: 'Jak będziesz ubezpieczony zdrowotnie?',
        uk: 'Як ви будете медично застраховані?',
        es: '¿Cómo estará asegurado médicamente?',
        fr: 'Comment serez-vous assuré pour la santé?'
      },
      accommodation: {
        de: 'Haben Sie bereits eine Unterkunft in Deutschland?',
        en: 'Do you already have accommodation in Germany?',
        tr: 'Almanya\'da kalacak yeriniz var mı?',
        ar: 'هل لديك سكن في ألمانيا؟',
        pl: 'Czy masz już zakwaterowanie w Niemczech?',
        uk: 'Чи маєте ви вже житло в Німеччині?',
        es: '¿Ya tiene alojamiento en Alemania?',
        fr: 'Avez-vous déjà un logement en Allemagne?'
      },
      financialSupport: {
        de: 'Wie finanzieren Sie Ihren Aufenthalt?',
        en: 'How will you finance your stay?',
        tr: 'Kalışınızı nasıl finanse edeceksiniz?',
        ar: 'كيف ستمول إقامتك؟',
        pl: 'Jak będziesz finansować swój pobyt?',
        uk: 'Як ви фінансуватимете своє перебування?',
        es: '¿Cómo financiará su estancia?',
        fr: 'Comment financerez-vous votre séjour?'
      }
    };

    const fieldQuestions = questions[fieldId] || {};
    return fieldQuestions[selectedLanguage] || fieldQuestions['de'] || 'Bitte geben Sie Ihre Antwort ein:';
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

    // Save to form data with intelligent formatting
    let valueToSave = inputValue.trim();
    const currentField = formFields.find(f => f.id === currentFieldId);

    // Apply formatting based on field type
    if (currentFieldId === 'fullName') {
      // Format name to Title Case
      valueToSave = formatNameToTitleCase(valueToSave);
    } else if (currentFieldId === 'dateOfBirth' || currentField?.type === 'date') {
      // Parse date to YYYY-MM-DD format
      const parsedDate = parseDate(valueToSave);
      if (parsedDate) {
        valueToSave = parsedDate;
      }
    } else if (currentField?.type === 'select') {
      // Normalize dropdown values
      valueToSave = normalizeDropdownValue(currentFieldId, valueToSave);
    }

    // Update the user's message to show the formatted value
    setMessages(prev => {
      const updated = [...prev];
      const lastUserMsgIndex = updated.length - 1;
      if (updated[lastUserMsgIndex]?.role === 'user') {
        updated[lastUserMsgIndex] = {
          ...updated[lastUserMsgIndex],
          content: valueToSave
        };
      }
      return updated;
    });

    const updatedFormData = {
      ...formData,
      [currentFieldId]: valueToSave
    };
    setFormData(updatedFormData);

    setInputValue('');

    // Reset lastAskedField so the next question can be asked
    setLastAskedField('');

    const currentIndex = formFields.findIndex(f => f.id === currentFieldId);
    const startIndex = currentIndex >= 0 ? currentIndex + 1 : undefined;
    askNextQuestion(startIndex, updatedFormData);
  };

  const handleFormFieldChange = (fieldId: string, value: any) => {
    // Clear error when user starts typing
    if (fieldErrors[fieldId]) {
      setFieldErrors(prev => ({
        ...prev,
        [fieldId]: ''
      }));
    }

    const updated = {
      ...formData,
      [fieldId]: value
    };
    setFormData(updated);
    
    // Update current step if this field is ahead of current progress
    const fieldIndex = formFields.findIndex(f => f.id === fieldId);
    if (fieldIndex !== -1 && value) {
      // If field is filled, move to next empty field
      let nextEmptyIndex = fieldIndex + 1;
      while (nextEmptyIndex < totalSteps && updated[formFields[nextEmptyIndex].id]) {
        nextEmptyIndex++;
      }
      
      if (nextEmptyIndex <= totalSteps) {
        setCurrentStep(nextEmptyIndex);
        if (nextEmptyIndex < totalSteps) {
          setCurrentFieldId(formFields[nextEmptyIndex].id);
          // Don't automatically ask next question when form is manually edited
          // Let the user continue filling the form or use chat
        }
      }
    }
  };

  const validateField = (fieldId: string, value: string) => {
    const field = formFields.find(f => f.id === fieldId);
    if (!field) return;

    let error = '';
    
    // Required field validation
    if (field.required && !value) {
      error = selectedLanguage === 'de' ? 'Dieses Feld ist erforderlich' : 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        error = selectedLanguage === 'de' ? 'Ungültige E-Mail-Adresse' : 'Invalid email address';
      }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
      const phoneRegex = /^[+]?[0-9\s\-()]+$/;
      if (!phoneRegex.test(value)) {
        error = selectedLanguage === 'de' ? 'Ungültige Telefonnummer' : 'Invalid phone number';
      }
    }
    
    setFieldErrors(prev => ({
      ...prev,
      [fieldId]: error
    }));
  };

  const getConfirmationMessage = () => {
    const messages: { [key: string]: string } = {
      de: 'Gespeichert',
      en: 'Saved',
      tr: 'Kaydedildi',
      ar: 'تم الحفظ',
      pl: 'Zapisano',
      uk: 'Збережено',
      es: 'Guardado',
      fr: 'Enregistré'
    };
    return messages[selectedLanguage] || messages['de'];
  };

  const getFieldLabel = (fieldId: string) => {
    const labels = formFieldTranslations[fieldId] || {};
    return labels[selectedLanguage] || labels['de'] || fieldId;
  };

  const getPlaceholderText = () => {
    const placeholders: { [key: string]: string } = {
      de: 'Bitte auswählen',
      en: 'Please select',
      tr: 'Lütfen seçin',
      ar: 'الرجاء اختيار',
      pl: 'Proszę wybrać',
      uk: 'Будь ласка, виберіть',
      es: 'Por favor seleccione',
      fr: 'Veuillez sélectionner'
    };
    return placeholders[selectedLanguage] || placeholders['de'];
  };

  const fillDemoData = async () => {
    setIsLoadingDemo(true);
    
    // Show loading message
    const loadingMessage: Message = {
      id: Date.now().toString(),
      role: 'system',
      content: selectedLanguage === 'de' 
        ? '⏳ Lade Demo-Daten...'
        : '⏳ Loading demo data...',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, loadingMessage]);
    
    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const demoDataByLanguage: { [key: string]: any } = {
      de: {
        fullName: 'Max Mustermann',
        dateOfBirth: '1990-05-15',
        nationality: 'TR',
        passportNumber: 'TR123456789',
        currentAddress: 'Atatürk Caddesi 123, 34000 Istanbul, Türkei',
        phoneNumber: '+90 532 123 4567',
        email: 'max.mustermann@example.com',
        maritalStatus: 'verheiratet',
        germanAddress: 'Hauptstraße 42, 10115 Berlin',
        plannedArrival: '2024-03-01',
        employerName: 'Tech Solutions GmbH',
        employerAddress: 'Innovationsweg 10, 80331 München',
        jobTitle: 'Senior Software Entwickler',
        jobDescription: 'Entwicklung von Cloud-basierten Anwendungen mit Fokus auf Microservices-Architektur. Verantwortlich für die technische Leitung eines 5-köpfigen Teams und die Implementierung von CI/CD-Pipelines.',
        contractDuration: 'Unbefristet',
        salary: '5500',
        workHours: '40',
        previousEmployment: 'Software Entwickler bei Digital Corp (2018-2024), Junior Entwickler bei StartUp AG (2015-2018)',
        qualifications: 'Master in Informatik (TU Istanbul, 2015), Bachelor in Informatik (Bogazici Universität, 2013), AWS Certified Solutions Architect, Scrum Master Zertifizierung',
        germanLevel: 'B2',
        criminalRecord: 'nein',
        healthInsurance: 'Techniker Krankenkasse (TK) - Arbeitgeber übernimmt 50%',
        accommodation: 'Möblierte 2-Zimmer Wohnung in Berlin-Mitte, bereits gemietet',
        financialSupport: 'Eigenes Einkommen durch Arbeitsvertrag, Ersparnisse von 15.000 EUR'
      },
      en: {
        fullName: 'John Smith',
        dateOfBirth: '1990-05-15',
        nationality: 'TR',
        passportNumber: 'TR123456789',
        currentAddress: 'Atatürk Street 123, 34000 Istanbul, Turkey',
        phoneNumber: '+90 532 123 4567',
        email: 'john.smith@example.com',
        maritalStatus: 'married',
        germanAddress: 'Main Street 42, 10115 Berlin',
        plannedArrival: '2024-03-01',
        employerName: 'Tech Solutions GmbH',
        employerAddress: 'Innovation Way 10, 80331 Munich',
        jobTitle: 'Senior Software Engineer',
        jobDescription: 'Development of cloud-based applications with focus on microservices architecture. Responsible for technical leadership of a 5-person team and implementation of CI/CD pipelines.',
        contractDuration: 'Permanent',
        salary: '5500',
        workHours: '40',
        previousEmployment: 'Software Engineer at Digital Corp (2018-2024), Junior Developer at StartUp Inc (2015-2018)',
        qualifications: 'Master in Computer Science (TU Istanbul, 2015), Bachelor in Computer Science (Bogazici University, 2013), AWS Certified Solutions Architect, Scrum Master Certification',
        germanLevel: 'B2',
        criminalRecord: 'no',
        healthInsurance: 'Techniker Krankenkasse (TK) - Employer covers 50%',
        accommodation: 'Furnished 2-room apartment in Berlin-Mitte, already rented',
        financialSupport: 'Own income through employment contract, savings of 15,000 EUR'
      },
      tr: {
        fullName: 'Mehmet Yılmaz',
        dateOfBirth: '1990-05-15',
        nationality: 'TR',
        passportNumber: 'TR123456789',
        currentAddress: 'Atatürk Caddesi 123, 34000 İstanbul, Türkiye',
        phoneNumber: '+90 532 123 4567',
        email: 'mehmet.yilmaz@example.com',
        maritalStatus: 'evli',
        germanAddress: 'Hauptstraße 42, 10115 Berlin',
        plannedArrival: '2024-03-01',
        employerName: 'Tech Solutions GmbH',
        employerAddress: 'Innovationsweg 10, 80331 Münih',
        jobTitle: 'Kıdemli Yazılım Mühendisi',
        jobDescription: 'Mikroservis mimarisine odaklanan bulut tabanlı uygulamaların geliştirilmesi. 5 kişilik ekibin teknik liderliği ve CI/CD hatlarının uygulanmasından sorumlu.',
        contractDuration: 'Süresiz',
        salary: '5500',
        workHours: '40',
        previousEmployment: 'Digital Corp\'ta Yazılım Mühendisi (2018-2024), StartUp AG\'de Junior Geliştirici (2015-2018)',
        qualifications: 'Bilgisayar Bilimleri Yüksek Lisansı (İstanbul Teknik Üniversitesi, 2015), Bilgisayar Bilimleri Lisansı (Boğaziçi Üniversitesi, 2013), AWS Certified Solutions Architect, Scrum Master Sertifikası',
        germanLevel: 'B2',
        criminalRecord: 'hayır',
        healthInsurance: 'Techniker Krankenkasse (TK) - İşveren %50 karşılıyor',
        accommodation: 'Berlin-Mitte\'de mobilyalı 2 odalı daire, kiralandı',
        financialSupport: 'İş sözleşmesi ile kendi geliri, 15.000 EUR birikim'
      },
      ar: {
        fullName: 'أحمد محمد',
        dateOfBirth: '1990-05-15',
        nationality: 'TR',
        passportNumber: 'TR123456789',
        currentAddress: 'شارع أتاتورك 123، 34000 إسطنبول، تركيا',
        phoneNumber: '+90 532 123 4567',
        email: 'ahmad.mohammed@example.com',
        maritalStatus: 'متزوج',
        germanAddress: 'شارع هاوبت 42، 10115 برلين',
        plannedArrival: '2024-03-01',
        employerName: 'Tech Solutions GmbH',
        employerAddress: 'طريق الابتكار 10، 80331 ميونخ',
        jobTitle: 'مهندس برمجيات أول',
        jobDescription: 'تطوير التطبيقات السحابية مع التركيز على بنية الخدمات الصغيرة. مسؤول عن القيادة الفنية لفريق من 5 أشخاص وتنفيذ خطوط CI/CD.',
        contractDuration: 'دائم',
        salary: '5500',
        workHours: '40',
        previousEmployment: 'مهندس برمجيات في Digital Corp (2018-2024)، مطور مبتدئ في StartUp AG (2015-2018)',
        qualifications: 'ماجستير في علوم الكمبيوتر (جامعة إسطنبول التقنية، 2015)، بكالوريوس في علوم الكمبيوتر (جامعة البوسفور، 2013)، AWS معتمد مهندس حلول، شهادة Scrum Master',
        germanLevel: 'B2',
        criminalRecord: 'لا',
        healthInsurance: 'Techniker Krankenkasse (TK) - صاحب العمل يغطي 50٪',
        accommodation: 'شقة مفروشة من غرفتين في برلين-ميتي، مستأجرة بالفعل',
        financialSupport: 'دخل خاص من خلال عقد العمل، مدخرات 15,000 يورو'
      },
      pl: {
        fullName: 'Jan Kowalski',
        dateOfBirth: '1990-05-15',
        nationality: 'TR',
        passportNumber: 'TR123456789',
        currentAddress: 'Ulica Atatürka 123, 34000 Stambuł, Turcja',
        phoneNumber: '+90 532 123 4567',
        email: 'jan.kowalski@example.com',
        maritalStatus: 'żonaty',
        germanAddress: 'Hauptstraße 42, 10115 Berlin',
        plannedArrival: '2024-03-01',
        employerName: 'Tech Solutions GmbH',
        employerAddress: 'Droga Innowacji 10, 80331 Monachium',
        jobTitle: 'Starszy Inżynier Oprogramowania',
        jobDescription: 'Rozwój aplikacji opartych na chmurze z naciskiem na architekturę mikroserwisów. Odpowiedzialny za kierownictwo techniczne 5-osobowego zespołu i wdrażanie potoków CI/CD.',
        contractDuration: 'Na czas nieokreślony',
        salary: '5500',
        workHours: '40',
        previousEmployment: 'Inżynier Oprogramowania w Digital Corp (2018-2024), Junior Developer w StartUp AG (2015-2018)',
        qualifications: 'Magister Informatyki (Politechnika Stambulska, 2015), Licencjat Informatyki (Uniwersytet Boğaziçi, 2013), AWS Certified Solutions Architect, Certyfikat Scrum Master',
        germanLevel: 'B2',
        criminalRecord: 'nie',
        healthInsurance: 'Techniker Krankenkasse (TK) - Pracodawca pokrywa 50%',
        accommodation: 'Umeblowane 2-pokojowe mieszkanie w Berlin-Mitte, już wynajęte',
        financialSupport: 'Własny dochód z umowy o pracę, oszczędności 15.000 EUR'
      },
      uk: {
        fullName: 'Іван Петренко',
        dateOfBirth: '1990-05-15',
        nationality: 'TR',
        passportNumber: 'TR123456789',
        currentAddress: 'Вулиця Ататюрка 123, 34000 Стамбул, Туреччина',
        phoneNumber: '+90 532 123 4567',
        email: 'ivan.petrenko@example.com',
        maritalStatus: 'одружений',
        germanAddress: 'Hauptstraße 42, 10115 Берлін',
        plannedArrival: '2024-03-01',
        employerName: 'Tech Solutions GmbH',
        employerAddress: 'Шлях Інновацій 10, 80331 Мюнхен',
        jobTitle: 'Старший інженер-програміст',
        jobDescription: 'Розробка хмарних додатків з акцентом на мікросервісну архітектуру. Відповідальний за технічне керівництво командою з 5 осіб та впровадження CI/CD конвеєрів.',
        contractDuration: 'Безстроковий',
        salary: '5500',
        workHours: '40',
        previousEmployment: 'Інженер-програміст у Digital Corp (2018-2024), Молодший розробник у StartUp AG (2015-2018)',
        qualifications: 'Магістр інформатики (Стамбульський технічний університет, 2015), Бакалавр інформатики (Університет Богазічі, 2013), AWS Certified Solutions Architect, Сертифікат Scrum Master',
        germanLevel: 'B2',
        criminalRecord: 'ні',
        healthInsurance: 'Techniker Krankenkasse (TK) - Роботодавець покриває 50%',
        accommodation: 'Мебльована 2-кімнатна квартира в Берлін-Мітте, вже орендована',
        financialSupport: 'Власний дохід за трудовим договором, заощадження 15.000 EUR'
      },
      es: {
        fullName: 'Juan García',
        dateOfBirth: '1990-05-15',
        nationality: 'TR',
        passportNumber: 'TR123456789',
        currentAddress: 'Calle Atatürk 123, 34000 Estambul, Turquía',
        phoneNumber: '+90 532 123 4567',
        email: 'juan.garcia@example.com',
        maritalStatus: 'casado',
        germanAddress: 'Hauptstraße 42, 10115 Berlín',
        plannedArrival: '2024-03-01',
        employerName: 'Tech Solutions GmbH',
        employerAddress: 'Camino de la Innovación 10, 80331 Múnich',
        jobTitle: 'Ingeniero de Software Senior',
        jobDescription: 'Desarrollo de aplicaciones basadas en la nube con enfoque en arquitectura de microservicios. Responsable del liderazgo técnico de un equipo de 5 personas e implementación de pipelines CI/CD.',
        contractDuration: 'Permanente',
        salary: '5500',
        workHours: '40',
        previousEmployment: 'Ingeniero de Software en Digital Corp (2018-2024), Desarrollador Junior en StartUp AG (2015-2018)',
        qualifications: 'Máster en Informática (Universidad Técnica de Estambul, 2015), Licenciatura en Informática (Universidad Boğaziçi, 2013), AWS Certified Solutions Architect, Certificación Scrum Master',
        germanLevel: 'B2',
        criminalRecord: 'no',
        healthInsurance: 'Techniker Krankenkasse (TK) - El empleador cubre el 50%',
        accommodation: 'Apartamento amueblado de 2 habitaciones en Berlin-Mitte, ya alquilado',
        financialSupport: 'Ingresos propios a través del contrato de trabajo, ahorros de 15.000 EUR'
      },
      fr: {
        fullName: 'Jean Dupont',
        dateOfBirth: '1990-05-15',
        nationality: 'TR',
        passportNumber: 'TR123456789',
        currentAddress: 'Rue Atatürk 123, 34000 Istanbul, Turquie',
        phoneNumber: '+90 532 123 4567',
        email: 'jean.dupont@example.com',
        maritalStatus: 'marié',
        germanAddress: 'Hauptstraße 42, 10115 Berlin',
        plannedArrival: '2024-03-01',
        employerName: 'Tech Solutions GmbH',
        employerAddress: 'Chemin de l\'Innovation 10, 80331 Munich',
        jobTitle: 'Ingénieur Logiciel Senior',
        jobDescription: 'Développement d\'applications basées sur le cloud avec focus sur l\'architecture microservices. Responsable du leadership technique d\'une équipe de 5 personnes et de l\'implémentation de pipelines CI/CD.',
        contractDuration: 'Permanent',
        salary: '5500',
        workHours: '40',
        previousEmployment: 'Ingénieur Logiciel chez Digital Corp (2018-2024), Développeur Junior chez StartUp AG (2015-2018)',
        qualifications: 'Master en Informatique (Université Technique d\'Istanbul, 2015), Licence en Informatique (Université Boğaziçi, 2013), AWS Certified Solutions Architect, Certification Scrum Master',
        germanLevel: 'B2',
        criminalRecord: 'non',
        healthInsurance: 'Techniker Krankenkasse (TK) - L\'employeur couvre 50%',
        accommodation: 'Appartement meublé de 2 pièces à Berlin-Mitte, déjà loué',
        financialSupport: 'Revenus propres par contrat de travail, économies de 15.000 EUR'
      }
    };
    
    const demoData = demoDataByLanguage[selectedLanguage] || demoDataByLanguage['de'];

    // Only fill empty fields, don't overwrite existing values
    setFormData(prev => {
      const merged = { ...prev }; // Start with existing data
      // Add demo data only for empty fields
      Object.keys(demoData).forEach(key => {
        if (!merged[key] || merged[key] === '') { // Only if field is empty
          merged[key] = demoData[key];
        }
      });
      return merged;
    });

    setCurrentStep(totalSteps); // Set to last step to show completion
    
    // Remove loading message and show success message
    setMessages(prev => prev.filter(msg => msg.id !== loadingMessage.id));
    
    // Show success message
    const successMessages: { [key: string]: string } = {
      de: '✨ Demo-Daten wurden erfolgreich eingefügt! Sie können jetzt die Export-Funktionen testen.',
      en: '✨ Demo data has been successfully filled! You can now test the export functions.',
      tr: '✨ Demo verileri başarıyla dolduruldu! Artık dışa aktarma işlevlerini test edebilirsiniz.',
      ar: '✨ تم ملء البيانات التجريبية بنجاح! يمكنك الآن اختبار وظائف التصدير.',
      pl: '✨ Dane demonstracyjne zostały pomyślnie wypełnione! Możesz teraz przetestować funkcje eksportu.',
      uk: '✨ Демо-дані успішно заповнені! Тепер ви можете протестувати функції експорту.',
      es: '✨ ¡Los datos de demostración se han rellenado con éxito! Ahora puede probar las funciones de exportación.',
      fr: '✨ Les données de démonstration ont été remplies avec succès ! Vous pouvez maintenant tester les fonctions d\'exportation.'
    };
    
    const successMessage: Message = {
      id: Date.now().toString(),
      role: 'system',
      content: successMessages[selectedLanguage] || successMessages['de'],
      timestamp: new Date()
    };
    setMessages(prev => [...prev, successMessage]);
    
    setIsLoadingDemo(false);
  };

  const getNationalityOptions = () => {
    const commonNationalities = [
      { value: 'TR', label: selectedLanguage === 'de' ? 'Türkei' : selectedLanguage === 'en' ? 'Turkey' : 'Türkiye' },
      { value: 'SY', label: selectedLanguage === 'de' ? 'Syrien' : selectedLanguage === 'en' ? 'Syria' : 'Suriye' },
      { value: 'PL', label: selectedLanguage === 'de' ? 'Polen' : selectedLanguage === 'en' ? 'Poland' : 'Polska' },
      { value: 'UA', label: selectedLanguage === 'de' ? 'Ukraine' : selectedLanguage === 'en' ? 'Ukraine' : 'Україна' },
      { value: 'IN', label: selectedLanguage === 'de' ? 'Indien' : selectedLanguage === 'en' ? 'India' : 'India' },
      { value: 'RU', label: selectedLanguage === 'de' ? 'Russland' : selectedLanguage === 'en' ? 'Russia' : 'Россия' },
      { value: 'CN', label: selectedLanguage === 'de' ? 'China' : selectedLanguage === 'en' ? 'China' : '中国' },
      { value: 'US', label: selectedLanguage === 'de' ? 'USA' : selectedLanguage === 'en' ? 'USA' : 'USA' },
      { value: 'OTHER', label: selectedLanguage === 'de' ? 'Andere' : selectedLanguage === 'en' ? 'Other' : 'Other' }
    ];
    return commonNationalities;
  };

  const getMaritalStatusOptions = () => {
    const statuses = {
      single: { de: 'Ledig', en: 'Single', tr: 'Bekar', ar: 'أعزب', pl: 'Kawaler/Panna', uk: 'Неодружений', es: 'Soltero', fr: 'Célibataire' },
      married: { de: 'Verheiratet', en: 'Married', tr: 'Evli', ar: 'متزوج', pl: 'Żonaty/Zamężna', uk: 'Одружений', es: 'Casado', fr: 'Marié' },
      divorced: { de: 'Geschieden', en: 'Divorced', tr: 'Boşanmış', ar: 'مطلق', pl: 'Rozwiedziony', uk: 'Розлучений', es: 'Divorciado', fr: 'Divorcé' },
      widowed: { de: 'Verwitwet', en: 'Widowed', tr: 'Dul', ar: 'أرمل', pl: 'Wdowiec/Wdowa', uk: 'Вдівець', es: 'Viudo', fr: 'Veuf' }
    };
    
    return Object.entries(statuses).map(([value, labels]) => ({
      value,
      label: labels[selectedLanguage as keyof typeof labels] || labels.de
    }));
  };

  const getGermanLevelOptions = () => {
    return [
      { value: 'none', label: selectedLanguage === 'de' ? 'Keine' : 'None' },
      { value: 'A1', label: 'A1 - Anfänger / Beginner' },
      { value: 'A2', label: 'A2 - Grundkenntnisse / Elementary' },
      { value: 'B1', label: 'B1 - Mittelstufe / Intermediate' },
      { value: 'B2', label: 'B2 - Gute Mittelstufe / Upper Intermediate' },
      { value: 'C1', label: 'C1 - Fortgeschritten / Advanced' },
      { value: 'C2', label: 'C2 - Exzellent / Proficient' }
    ];
  };

  const getYesNoOptions = () => {
    const options = {
      no: { de: 'Nein', en: 'No', tr: 'Hayır', ar: 'لا', pl: 'Nie', uk: 'Ні', es: 'No', fr: 'Non' },
      yes: { de: 'Ja', en: 'Yes', tr: 'Evet', ar: 'نعم', pl: 'Tak', uk: 'Так', es: 'Sí', fr: 'Oui' }
    };
    
    return Object.entries(options).map(([value, labels]) => ({
      value,
      label: labels[selectedLanguage as keyof typeof labels] || labels.de
    }));
  };

  const handlePrint = () => {
    // Open export modal instead of direct print to allow language selection
    setShowExportModal(true);
  };

  const getExportButtonText = () => {
    const languageNames: { [key: string]: string } = {
      de: 'Deutsch',
      en: 'English',
      tr: 'Türkçe',
      ar: 'العربية',
      pl: 'Polski',
      uk: 'Українська',
      es: 'Español',
      fr: 'Français'
    };
    
    const exportText: { [key: string]: string } = {
      de: 'Export',
      en: 'Export',
      tr: 'Dışa Aktar',
      ar: 'تصدير',
      pl: 'Eksport',
      uk: 'Експорт',
      es: 'Exportar',
      fr: 'Exporter'
    };
    
    return `${exportText[selectedLanguage] || exportText['de']} (${languageNames[selectedLanguage] || languageNames['de']})`;
  };
  
  const getPrintButtonText = () => {
    const texts: { [key: string]: string } = {
      de: 'Drucken',
      en: 'Print',
      tr: 'Yazdır',
      ar: 'طباعة',
      pl: 'Drukuj',
      uk: 'Друк',
      es: 'Imprimir',
      fr: 'Imprimer'
    };
    return texts[selectedLanguage] || texts['de'];
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50">
      {/* Chat Section - Left Side */}
      <div className="w-1/2 flex flex-col border-r">
        {/* Header */}
        <header className="bg-white shadow-sm px-4 py-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="font-semibold text-gray-900">Chat Assistant</h2>
                <p className="text-sm text-gray-600">
                  {getStepText()} {filledFields} / {totalSteps}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Demo Button ausgeblendet - Nutzen Sie Strg+D oder Cmd+D */}
              <select
                value={selectedLanguage}
                onChange={(e) => {
                  const newLang = e.target.value;
                  if (onLanguageChange) {
                    onLanguageChange(newLang);
                  } else if (setSelectedLanguage) {
                    setSelectedLanguage(newLang);
                  }
                }}
                className="px-3 py-2 border rounded-lg text-sm bg-white"
                disabled={isTranslating}
              >
                {supportedLanguages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role !== 'user' && (
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    message.role === 'system' ? 'bg-gray-200' : 'bg-blue-100'
                  }`}>
                    {message.role === 'system' ? <Check className="w-5 h-5 text-green-600" /> : <Bot className="w-5 h-5 text-blue-600" />}
                  </div>
                )}
                
                <div
                  className={`max-w-sm px-4 py-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : message.role === 'system'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-white text-gray-900 shadow-sm border'
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
                  <p className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                
                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center ml-3">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <Bot className="w-5 h-5 text-blue-600" />
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
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={getInputPlaceholder()}
              className="flex-1 px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Form Preview - Right Side (Fully Editable) */}
      <div className="w-1/2 bg-white overflow-y-auto">
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  {getFormTitle()}
                </h2>
                <p className="text-gray-600 mt-1">{getFormSubtitle()}</p>
              </div>
              <div className="flex gap-2">
                {/* Demo Button ausgeblendet - Nutzen Sie Strg+D oder Cmd+D */}
                <button
                  onClick={handlePrint}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  title={getPrintButtonText()}
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden lg:inline">{getPrintButtonText()}</span>
                </button>
                
                <button
                  onClick={() => setShowExportModal(true)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  title={getExportButtonText()}
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden lg:inline">{getExportButtonText()}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {formFields.map((field) => (
              <div key={field.id} className="border-b pb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getFieldLabel(field.id)}
                  {formData[field.id] && (
                    <span className="ml-2 text-green-600">✓</span>
                  )}
                </label>
                
                {field.type === 'select' ? (
                  <>
                    <select
                      value={formData[field.id] || ''}
                      onChange={(e) => handleFormFieldChange(field.id, e.target.value)}
                      onBlur={(e) => validateField(field.id, e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${fieldErrors[field.id] ? 'border-red-500' : ''}`}
                      required={field.required}
                    >
                      <option value="">{getPlaceholderText()}</option>
                      {field.id === 'nationality' && getNationalityOptions().map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                      {field.id === 'maritalStatus' && getMaritalStatusOptions().map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                      {field.id === 'germanLevel' && getGermanLevelOptions().map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                      {field.id === 'criminalRecord' && getYesNoOptions().map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    {fieldErrors[field.id] && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors[field.id]}</p>
                    )}
                  </>
                ) : field.type === 'textarea' ? (
                  <>
                    <textarea
                      value={formData[field.id] || ''}
                      onChange={(e) => handleFormFieldChange(field.id, e.target.value)}
                      onBlur={(e) => validateField(field.id, e.target.value)}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${fieldErrors[field.id] ? 'border-red-500' : ''}`}
                      placeholder="..."
                      required={field.required}
                    />
                    {fieldErrors[field.id] && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors[field.id]}</p>
                    )}
                  </>
                ) : (
                  <>
                    <input
                      type={field.type}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleFormFieldChange(field.id, e.target.value)}
                      onBlur={(e) => validateField(field.id, e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${fieldErrors[field.id] ? 'border-red-500' : ''}`}
                      placeholder={field.type === 'date' ? '' : '...'}
                      required={field.required}
                    />
                    {fieldErrors[field.id] && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors[field.id]}</p>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Summary Section */}
          {filledFields > 0 && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                {getProgressText()}: {filledFields} / {totalSteps}
              </h3>
              <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        formData={formData}
        selectedLanguage={selectedLanguage}
      />
    </div>
  );

  function getInputPlaceholder(): string {
    const texts: { [key: string]: string } = {
      de: 'Ihre Antwort eingeben...',
      en: 'Enter your answer...',
      tr: 'Cevabınızı girin...',
      ar: 'أدخل إجابتك...',
      pl: 'Wpisz swoją odpowiedź...',
      uk: 'Введіть вашу відповідь...',
      es: 'Ingrese su respuesta...',
      fr: 'Entrez votre réponse...'
    };
    return texts[selectedLanguage] || texts['de'];
  }

  function getStepText(): string {
    const texts: { [key: string]: string } = {
      de: 'Schritt',
      en: 'Step',
      tr: 'Adım',
      ar: 'خطوة',
      pl: 'Krok',
      uk: 'Крок',
      es: 'Paso',
      fr: 'Étape'
    };
    return texts[selectedLanguage] || texts['de'];
  }

  function getFormTitle(): string {
    const texts: { [key: string]: string } = {
      de: 'Arbeitserlaubnis Formular',
      en: 'Work Permit Form',
      tr: 'Çalışma İzni Formu',
      ar: 'نموذج تصريح العمل',
      pl: 'Formularz pozwolenia na pracę',
      uk: 'Форма дозволу на роботу',
      es: 'Formulario de permiso de trabajo',
      fr: 'Formulaire de permis de travail'
    };
    return texts[selectedLanguage] || texts['de'];
  }

  function getFormSubtitle(): string {
    const texts: { [key: string]: string } = {
      de: 'Direkt editierbar - Alle Felder können bearbeitet werden',
      en: 'Directly editable - All fields can be edited',
      tr: 'Doğrudan düzenlenebilir - Tüm alanlar düzenlenebilir',
      ar: 'قابل للتحرير مباشرة - يمكن تحرير جميع الحقول',
      pl: 'Bezpośrednio edytowalne - Wszystkie pola mogą być edytowane',
      uk: 'Безпосередньо редагується - Всі поля можна редагувати',
      es: 'Directamente editable - Todos los campos se pueden editar',
      fr: 'Directement modifiable - Tous les champs peuvent être modifiés'
    };
    return texts[selectedLanguage] || texts['de'];
  }

  function getProgressText(): string {
    const texts: { [key: string]: string } = {
      de: 'Fortschritt',
      en: 'Progress',
      tr: 'İlerleme',
      ar: 'التقدم',
      pl: 'Postęp',
      uk: 'Прогрес',
      es: 'Progreso',
      fr: 'Progrès'
    };
    return texts[selectedLanguage] || texts['de'];
  }
}