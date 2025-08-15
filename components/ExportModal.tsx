'use client';

import { useState } from 'react';
import { X, FileText, FileSpreadsheet, FileCode, Printer, Download, Check } from 'lucide-react';
import { exportToPDF, exportToWord, exportToExcel, exportToJSON, printForm } from '@/lib/exportService';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
  selectedLanguage: string;
}

export default function ExportModal({ isOpen, onClose, formData, selectedLanguage }: ExportModalProps) {
  const [exporting, setExporting] = useState<string | null>(null);
  const [exported, setExported] = useState<string[]>([]);
  const [exportLanguage, setExportLanguage] = useState(selectedLanguage);
  const [isTranslating, setIsTranslating] = useState(false);

  if (!isOpen) return null;

  const translateFormData = async (data: any, targetLanguage: string) => {
    if (targetLanguage === selectedLanguage) {
      return data;
    }

    try {
      setIsTranslating(true);
      
      // If we're exporting to German and the current language is not German,
      // ensure we get clean German text without special characters
      if (targetLanguage === 'de') {
        // For critical fields that might have special characters, use predefined translations
        const cleanData = { ...data };
        
        // Clean any Arabic or special characters that might appear
        Object.keys(cleanData).forEach(key => {
          if (typeof cleanData[key] === 'string') {
            // Remove Arabic characters and other problematic unicode
            cleanData[key] = cleanData[key].replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g, '');
          }
        });
        
        data = cleanData;
      }
      
      const response = await fetch('/api/ollama/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          values: data,
          fromLanguage: selectedLanguage,
          toLanguage: targetLanguage
        })
      });

      if (response.ok) {
        const result = await response.json();
        const translatedData = result.translatedValues || data;
        
        // Clean the translated data to ensure no encoding issues
        if (targetLanguage === 'de') {
          Object.keys(translatedData).forEach(key => {
            if (typeof translatedData[key] === 'string') {
              // Ensure clean German text
              translatedData[key] = translatedData[key]
                .replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g, '')
                .trim();
            }
          });
        }
        
        return translatedData;
      }
      return data;
    } catch (error) {
      console.error('Translation error:', error);
      return data;
    } finally {
      setIsTranslating(false);
    }
  };

  const handleExport = async (format: string) => {
    setExporting(format);
    
    try {
      // Translate form data if export language differs from current language
      const translatedData = await translateFormData(formData, exportLanguage);
      
      switch (format) {
        case 'pdf':
          await exportToPDF(translatedData, exportLanguage);
          break;
        case 'word':
          await exportToWord(translatedData, exportLanguage);
          break;
        case 'excel':
          await exportToExcel(translatedData, exportLanguage);
          break;
        case 'json':
          exportToJSON(translatedData);
          break;
        case 'print':
          printForm(translatedData, exportLanguage);
          break;
      }
      
      setExported([...exported, format]);
      
      // Reset after animation
      setTimeout(() => {
        setExported(prev => prev.filter(f => f !== format));
      }, 2000);
    } catch (error) {
      console.error(`Export failed for ${format}:`, error);
    } finally {
      setExporting(null);
    }
  };

  const exportOptions = [
    {
      id: 'pdf',
      icon: FileText,
      title: {
        de: 'PDF Dokument',
        en: 'PDF Document',
        tr: 'PDF Belgesi',
        ar: 'مستند PDF',
        pl: 'Dokument PDF',
        uk: 'PDF документ',
        es: 'Documento PDF',
        fr: 'Document PDF'
      },
      description: {
        de: 'Formatiertes PDF zum Drucken oder Versenden',
        en: 'Formatted PDF for printing or sending',
        tr: 'Yazdırma veya gönderme için formatlanmış PDF',
        ar: 'PDF منسق للطباعة أو الإرسال',
        pl: 'Sformatowany PDF do druku lub wysyłki',
        uk: 'Форматований PDF для друку або відправки',
        es: 'PDF formateado para imprimir o enviar',
        fr: 'PDF formaté pour impression ou envoi'
      },
      color: 'bg-red-100 text-red-600',
      hoverColor: 'hover:bg-red-200'
    },
    {
      id: 'word',
      icon: FileText,
      title: {
        de: 'Word Dokument',
        en: 'Word Document',
        tr: 'Word Belgesi',
        ar: 'مستند Word',
        pl: 'Dokument Word',
        uk: 'Word документ',
        es: 'Documento Word',
        fr: 'Document Word'
      },
      description: {
        de: 'Bearbeitbares Word-Dokument (.docx)',
        en: 'Editable Word document (.docx)',
        tr: 'Düzenlenebilir Word belgesi (.docx)',
        ar: 'مستند Word قابل للتحرير',
        pl: 'Edytowalny dokument Word (.docx)',
        uk: 'Редагований документ Word (.docx)',
        es: 'Documento Word editable (.docx)',
        fr: 'Document Word modifiable (.docx)'
      },
      color: 'bg-blue-100 text-blue-600',
      hoverColor: 'hover:bg-blue-200'
    },
    {
      id: 'excel',
      icon: FileSpreadsheet,
      title: {
        de: 'Excel Tabelle',
        en: 'Excel Spreadsheet',
        tr: 'Excel Tablosu',
        ar: 'جدول Excel',
        pl: 'Arkusz Excel',
        uk: 'Таблиця Excel',
        es: 'Hoja de Excel',
        fr: 'Feuille Excel'
      },
      description: {
        de: 'Strukturierte Daten in Excel-Format',
        en: 'Structured data in Excel format',
        tr: 'Excel formatında yapılandırılmış veri',
        ar: 'بيانات منظمة بتنسيق Excel',
        pl: 'Dane strukturalne w formacie Excel',
        uk: 'Структуровані дані у форматі Excel',
        es: 'Datos estructurados en formato Excel',
        fr: 'Données structurées au format Excel'
      },
      color: 'bg-green-100 text-green-600',
      hoverColor: 'hover:bg-green-200'
    },
    {
      id: 'json',
      icon: FileCode,
      title: {
        de: 'JSON Backup',
        en: 'JSON Backup',
        tr: 'JSON Yedekleme',
        ar: 'نسخة احتياطية JSON',
        pl: 'Kopia JSON',
        uk: 'JSON резервна копія',
        es: 'Respaldo JSON',
        fr: 'Sauvegarde JSON'
      },
      description: {
        de: 'Datensicherung für spätere Verwendung',
        en: 'Data backup for later use',
        tr: 'Sonraki kullanım için veri yedekleme',
        ar: 'نسخ احتياطي للبيانات للاستخدام لاحقًا',
        pl: 'Kopia zapasowa danych do późniejszego użycia',
        uk: 'Резервне копіювання даних для подальшого використання',
        es: 'Copia de seguridad para uso posterior',
        fr: 'Sauvegarde des données pour utilisation ultérieure'
      },
      color: 'bg-purple-100 text-purple-600',
      hoverColor: 'hover:bg-purple-200'
    },
    {
      id: 'print',
      icon: Printer,
      title: {
        de: 'Drucken',
        en: 'Print',
        tr: 'Yazdır',
        ar: 'طباعة',
        pl: 'Drukuj',
        uk: 'Друк',
        es: 'Imprimir',
        fr: 'Imprimer'
      },
      description: {
        de: 'Direkt über Ihren Browser drucken',
        en: 'Print directly from your browser',
        tr: 'Doğrudan tarayıcınızdan yazdırın',
        ar: 'اطبع مباشرة من متصفحك',
        pl: 'Drukuj bezpośrednio z przeglądarki',
        uk: 'Друкувати безпосередньо з браузера',
        es: 'Imprimir directamente desde el navegador',
        fr: 'Imprimer directement depuis votre navigateur'
      },
      color: 'bg-gray-100 text-gray-600',
      hoverColor: 'hover:bg-gray-200'
    }
  ];

  const getModalTitle = () => {
    const titles: { [key: string]: string } = {
      de: 'Export-Optionen',
      en: 'Export Options',
      tr: 'Dışa Aktarma Seçenekleri',
      ar: 'خيارات التصدير',
      pl: 'Opcje eksportu',
      uk: 'Параметри експорту',
      es: 'Opciones de exportación',
      fr: 'Options d\'export'
    };
    return titles[selectedLanguage] || titles['de'];
  };

  const getModalSubtitle = () => {
    const subtitles: { [key: string]: string } = {
      de: 'Wählen Sie das gewünschte Format',
      en: 'Choose your preferred format',
      tr: 'Tercih ettiğiniz formatı seçin',
      ar: 'اختر التنسيق المفضل لديك',
      pl: 'Wybierz preferowany format',
      uk: 'Виберіть бажаний формат',
      es: 'Elija su formato preferido',
      fr: 'Choisissez votre format préféré'
    };
    return subtitles[selectedLanguage] || subtitles['de'];
  };

  const getExportLanguageLabel = () => {
    const labels: { [key: string]: string } = {
      de: 'Export-Sprache',
      en: 'Export Language',
      tr: 'Dışa Aktarma Dili',
      ar: 'لغة التصدير',
      pl: 'Język eksportu',
      uk: 'Мова експорту',
      es: 'Idioma de exportación',
      fr: 'Langue d\'exportation'
    };
    return labels[selectedLanguage] || labels['de'];
  };

  const languages = [
    { code: 'de', name: 'Deutsch' },
    { code: 'en', name: 'English' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'ar', name: 'العربية' },
    { code: 'pl', name: 'Polski' },
    { code: 'uk', name: 'Українська' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{getModalTitle()}</h2>
              <p className="text-gray-600 mt-1">{getModalSubtitle()}</p>
              
              {/* Language Selector */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getExportLanguageLabel()}
                </label>
                <select
                  value={exportLanguage}
                  onChange={(e) => setExportLanguage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isTranslating || exporting !== null}
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                {exportLanguage !== selectedLanguage && (
                  <p className="text-xs text-blue-600 mt-1">
                    {selectedLanguage === 'de' 
                      ? 'Formularwerte werden mit Ollama übersetzt'
                      : 'Form values will be translated using Ollama'}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-4"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Export Options */}
        <div className="p-6 grid gap-4">
          {exportOptions.map((option) => {
            const Icon = option.icon;
            const isExporting = exporting === option.id;
            const isExported = exported.includes(option.id);
            
            return (
              <button
                key={option.id}
                onClick={() => handleExport(option.id)}
                disabled={isExporting || isTranslating}
                className={`
                  p-4 rounded-lg border-2 transition-all text-left
                  ${(isExporting || isTranslating) ? 'opacity-50 cursor-wait' : ''}
                  ${isExported ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}
                  ${!isExporting && !isExported && !isTranslating ? option.hoverColor : ''}
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${option.color}`}>
                    {isExported ? (
                      <Check className="w-6 h-6 text-green-600" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {option.title[selectedLanguage as keyof typeof option.title] || option.title['de']}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {option.description[selectedLanguage as keyof typeof option.description] || option.description['de']}
                    </p>
                  </div>
                  {(isExporting || (isTranslating && exporting === option.id)) && (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                      {isTranslating && (
                        <span className="ml-2 text-xs text-gray-600">
                          {selectedLanguage === 'de' ? 'Übersetze...' : 'Translating...'}
                        </span>
                      )}
                    </div>
                  )}
                  {isExported && (
                    <div className="flex items-center">
                      <span className="text-green-600 text-sm font-medium">
                        {selectedLanguage === 'de' ? 'Erfolgreich!' : 'Success!'}
                      </span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <p className="text-sm text-gray-500 text-center">
            {selectedLanguage === 'de' 
              ? 'Ihre Daten werden sicher verarbeitet und nicht gespeichert.'
              : 'Your data is processed securely and not stored.'}
          </p>
          {isTranslating && (
            <div className="mt-2 flex items-center justify-center">
              <div className="animate-pulse text-blue-600 text-sm">
                {selectedLanguage === 'de' 
                  ? 'Übersetze Formularwerte mit Ollama...'
                  : 'Translating form values with Ollama...'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}