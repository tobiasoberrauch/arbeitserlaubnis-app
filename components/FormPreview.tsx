'use client';

import { useState } from 'react';
import { Download, Edit2, Check, FileText, Printer } from 'lucide-react';
import ExportModal from './ExportModal';

interface FormPreviewProps {
  formData: any;
  onConfirm: () => void;
  onEdit: () => void;
  selectedLanguage: string;
}

export default function FormPreview({ formData, onConfirm, onEdit, selectedLanguage }: FormPreviewProps) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  
  const handlePrint = () => {
    // Open export modal in print mode
    setShowExportModal(true);
  };

  const formatFieldLabel = (field: string): string => {
    const labels: { [key: string]: { [lang: string]: string } } = {
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
        fr: 'Email'
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
        tr: 'Finansal Destek',
        ar: 'الدعم المالي',
        pl: 'Wsparcie finansowe',
        uk: 'Фінансова підтримка',
        es: 'Apoyo financiero',
        fr: 'Soutien financier'
      }
    };
    
    const fieldLabels = labels[field];
    if (fieldLabels) {
      return fieldLabels[selectedLanguage] || fieldLabels['de'];
    }
    return field;
  };

  const getTitle = () => {
    const titles: { [key: string]: string } = {
      de: 'Überprüfen Sie Ihre Angaben',
      en: 'Review Your Information',
      tr: 'Bilgilerinizi Gözden Geçirin',
      ar: 'راجع معلوماتك',
      pl: 'Sprawdź swoje informacje',
      uk: 'Перевірте вашу інформацію',
      es: 'Revise su información',
      fr: 'Vérifiez vos informations'
    };
    return titles[selectedLanguage] || titles['de'];
  };

  const getSubtitle = () => {
    const subtitles: { [key: string]: string } = {
      de: 'Bitte überprüfen Sie alle Angaben sorgfältig',
      en: 'Please review all information carefully',
      tr: 'Lütfen tüm bilgileri dikkatlice gözden geçirin',
      ar: 'يرجى مراجعة جميع المعلومات بعناية',
      pl: 'Proszę dokładnie sprawdzić wszystkie informacje',
      uk: 'Будь ласка, уважно перевірте всю інформацію',
      es: 'Por favor revise toda la información cuidadosamente',
      fr: 'Veuillez vérifier toutes les informations attentivement'
    };
    return subtitles[selectedLanguage] || subtitles['de'];
  };

  const getEditButtonText = () => {
    const texts: { [key: string]: string } = {
      de: 'Bearbeiten',
      en: 'Edit',
      tr: 'Düzenle',
      ar: 'تحرير',
      pl: 'Edytuj',
      uk: 'Редагувати',
      es: 'Editar',
      fr: 'Modifier'
    };
    return texts[selectedLanguage] || texts['de'];
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
      de: 'Exportieren',
      en: 'Export',
      tr: 'Dışa Aktar',
      ar: 'تصدير',
      pl: 'Eksportuj',
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
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {getTitle()}
            </h1>
            <p className="text-gray-600">
              {getSubtitle()}
            </p>
          </div>

          <div className="space-y-6 mb-8">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} className="border-b pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      {formatFieldLabel(key)}
                    </h3>
                    <p className="text-lg text-gray-900">
                      {value || '-'}
                    </p>
                  </div>
                  <Check className="w-5 h-5 text-green-500 mt-1" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onEdit}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
            >
              <Edit2 className="w-5 h-5" />
              <span className="hidden sm:inline">{getEditButtonText()}</span>
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-5 h-5" />
              <span className="hidden sm:inline">{getPrintButtonText()}</span>
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">{getExportButtonText()}</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => {
          setShowExportModal(false);
          onConfirm();
        }}
        formData={formData}
        selectedLanguage={selectedLanguage}
      />
    </div>
  );
}