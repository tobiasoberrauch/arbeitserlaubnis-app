import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType } from 'docx';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

interface ExportData {
  [key: string]: any;
}

// Translation mappings for field labels
const fieldTranslations: { [key: string]: { [lang: string]: string } } = {
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

const getFieldLabel = (field: string, language: string): string => {
  return fieldTranslations[field]?.[language] || fieldTranslations[field]?.['de'] || field;
};

// Enhanced PDF Export with better formatting
export const exportToPDF = async (data: ExportData, language: string = 'de') => {
  const pdf = new jsPDF();
  
  // Use helvetica font which is more reliable
  pdf.setFont('helvetica');
  
  // Helper function to clean text for PDF
  const cleanTextForPDF = (text: string): string => {
    if (!text) return '-';
    // Remove or replace problematic characters
    return text
      .replace(/[\u0080-\uFFFF]/g, (match) => {
        // Try to transliterate common characters
        const replacements: { [key: string]: string } = {
          'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'Ä': 'Ae', 'Ö': 'Oe', 'Ü': 'Ue',
          'ß': 'ss', 'é': 'e', 'è': 'e', 'ê': 'e', 'à': 'a', 'ç': 'c',
          'ñ': 'n', 'í': 'i', 'ó': 'o', 'ú': 'u', 'á': 'a'
        };
        return replacements[match] || '?';
      });
  };
  
  // Title
  const title = language === 'de' ? 'Arbeitserlaubnis Antrag' : 'Work Permit Application';
  pdf.setFontSize(20);
  pdf.text(title, 105, 20, { align: 'center' });
  
  // Date
  pdf.setFontSize(10);
  const dateLabel = language === 'de' ? 'Datum' : 'Date';
  pdf.text(`${dateLabel}: ${new Date().toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US')}`, 20, 35);
  
  // Content
  let yPosition = 50;
  pdf.setFontSize(12);
  
  // Group fields by sections
  const sections = {
    personal: ['fullName', 'dateOfBirth', 'nationality', 'passportNumber', 'maritalStatus'],
    contact: ['currentAddress', 'phoneNumber', 'email', 'germanAddress', 'plannedArrival'],
    employment: ['employerName', 'employerAddress', 'jobTitle', 'jobDescription', 'contractDuration', 'salary', 'workHours'],
    qualifications: ['previousEmployment', 'qualifications', 'germanLevel'],
    additional: ['criminalRecord', 'healthInsurance', 'accommodation', 'financialSupport']
  };
  
  const sectionTitles: { [key: string]: { [lang: string]: string } } = {
    personal: { de: 'Persönliche Daten', en: 'Personal Information' },
    contact: { de: 'Kontaktdaten', en: 'Contact Information' },
    employment: { de: 'Beschäftigungsdaten', en: 'Employment Information' },
    qualifications: { de: 'Qualifikationen', en: 'Qualifications' },
    additional: { de: 'Zusätzliche Informationen', en: 'Additional Information' }
  };
  
  Object.entries(sections).forEach(([sectionKey, fields]) => {
    // Section title
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(sectionTitles[sectionKey][language] || sectionTitles[sectionKey]['de'], 20, yPosition);
    yPosition += 10;
    
    // Section fields
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    
    fields.forEach(field => {
      if (data[field]) {
        const label = getFieldLabel(field, language);
        const value = data[field] || '-';
        
        // Check if we need a new page
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }
        
        // Label
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${label}:`, 20, yPosition);
        
        // Value - clean text for PDF
        pdf.setFont('helvetica', 'normal');
        const cleanedValue = cleanTextForPDF(String(value));
        const textLines = pdf.splitTextToSize(cleanedValue, 160);
        pdf.text(textLines, 25, yPosition + 5);
        
        yPosition += 5 + (textLines.length * 5) + 3;
      }
    });
    
    yPosition += 5; // Space between sections
  });
  
  // Footer
  pdf.setFontSize(8);
  pdf.text('Generated by MIGSTART AI', 105, 290, { align: 'center' });
  
  // Save the PDF
  pdf.save(`arbeitserlaubnis_${Date.now()}.pdf`);
};

// Export to Word Document (.docx)
export const exportToWord = async (data: ExportData, language: string = 'de') => {
  // Helper function to ensure text is safe for Word export
  const ensureSafeText = (text: string): string => {
    if (!text) return '-';
    // Ensure we only have clean text without problematic characters
    return String(text)
      .replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g, '') // Remove Arabic
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
      .trim() || '-';
  };

  // Group fields by sections for better organization
  const sections = {
    personal: ['fullName', 'dateOfBirth', 'nationality', 'passportNumber', 'maritalStatus'],
    contact: ['currentAddress', 'phoneNumber', 'email', 'germanAddress', 'plannedArrival'],
    employment: ['employerName', 'employerAddress', 'jobTitle', 'jobDescription', 'contractDuration', 'salary', 'workHours'],
    qualifications: ['previousEmployment', 'qualifications', 'germanLevel'],
    additional: ['criminalRecord', 'healthInsurance', 'accommodation', 'financialSupport']
  };
  
  const sectionTitles: { [key: string]: { [lang: string]: string } } = {
    personal: { de: 'Persönliche Daten', en: 'Personal Information' },
    contact: { de: 'Kontaktdaten', en: 'Contact Information' },
    employment: { de: 'Beschäftigungsdaten', en: 'Employment Information' },
    qualifications: { de: 'Qualifikationen', en: 'Qualifications' },
    additional: { de: 'Zusätzliche Informationen', en: 'Additional Information' }
  };

  const children: any[] = [
    // Title
    new Paragraph({
      text: language === 'de' ? 'Arbeitserlaubnis Antrag' : 'Work Permit Application',
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
    }),
    
    // Date
    new Paragraph({
      text: `${language === 'de' ? 'Datum' : 'Date'}: ${new Date().toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US')}`,
      spacing: { after: 200 },
    }),
  ];

  // Add sections with fields
  Object.entries(sections).forEach(([sectionKey, fields]) => {
    // Section title
    children.push(
      new Paragraph({
        text: sectionTitles[sectionKey][language] || sectionTitles[sectionKey]['de'],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 100 },
      })
    );

    // Section fields
    fields.forEach(field => {
      if (data[field]) {
        const label = getFieldLabel(field, language);
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${label}: `,
                bold: true,
              }),
              new TextRun({
                text: ensureSafeText(data[field]),
              }),
            ],
            spacing: { after: 100 },
          })
        );
      }
    });
  });

  // Footer
  children.push(
    new Paragraph({
      text: 'Generated by MIGSTART AI',
      alignment: AlignmentType.CENTER,
      spacing: { before: 400 },
    })
  );

  const doc = new Document({
    sections: [{
      properties: {},
      children: children
    }],
  });
  
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `arbeitserlaubnis_${Date.now()}.docx`);
};

// Export to Excel (.xlsx)
export const exportToExcel = async (data: ExportData, language: string = 'de') => {
  // Helper function to ensure text is safe for Excel export
  const ensureSafeText = (text: string): string => {
    if (!text) return '-';
    return String(text)
      .replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g, '') // Remove Arabic
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
      .trim() || '-';
  };

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(language === 'de' ? 'Arbeitserlaubnis' : 'Work Permit');
  
  // Title
  worksheet.mergeCells('A1:B3');
  worksheet.getCell('A1').value = language === 'de' ? 'Arbeitserlaubnis Antrag' : 'Work Permit Application';
  worksheet.getCell('A1').font = { size: 16, bold: true };
  worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
  
  // Date
  worksheet.getCell('A5').value = language === 'de' ? 'Datum' : 'Date';
  worksheet.getCell('B5').value = new Date().toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US');
  
  // Headers
  worksheet.getCell('A7').value = language === 'de' ? 'Feld' : 'Field';
  worksheet.getCell('B7').value = language === 'de' ? 'Wert' : 'Value';
  worksheet.getRow(7).font = { bold: true };
  worksheet.getRow(7).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' },
  };
  
  // Data
  let row = 8;
  Object.entries(data).forEach(([key, value]) => {
    const label = getFieldLabel(key, language);
    worksheet.getCell(`A${row}`).value = label;
    worksheet.getCell(`B${row}`).value = ensureSafeText(String(value));
    row++;
  });
  
  // Styling
  worksheet.columns = [
    { key: 'field', width: 30 },
    { key: 'value', width: 50 },
  ];
  
  // Borders
  for (let i = 7; i < row; i++) {
    ['A', 'B'].forEach(col => {
      worksheet.getCell(`${col}${i}`).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  }
  
  // Save
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `arbeitserlaubnis_${Date.now()}.xlsx`);
};

// Export to JSON (for data backup)
export const exportToJSON = (data: ExportData) => {
  const jsonData = {
    metadata: {
      type: 'work_permit_application',
      created: new Date().toISOString(),
      version: '1.0'
    },
    data: data
  };
  
  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
  saveAs(blob, `arbeitserlaubnis_${Date.now()}.json`);
};

// Print function
export const printForm = (data: ExportData, language: string = 'de') => {
  // Helper function to ensure text is safe for HTML
  const ensureSafeHTML = (text: string): string => {
    if (!text) return '-';
    return String(text)
      .replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g, '') // Remove Arabic
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .trim() || '-';
  };

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  const title = language === 'de' ? 'Arbeitserlaubnis Antrag' : 'Work Permit Application';
  
  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }
        h1 {
          text-align: center;
          color: #333;
          border-bottom: 2px solid #333;
          padding-bottom: 10px;
        }
        .section {
          margin: 20px 0;
          page-break-inside: avoid;
        }
        .section h2 {
          color: #555;
          border-bottom: 1px solid #ddd;
          padding-bottom: 5px;
        }
        .field {
          margin: 10px 0;
          display: flex;
        }
        .label {
          font-weight: bold;
          min-width: 200px;
        }
        .value {
          flex: 1;
        }
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
        .footer {
          text-align: center;
          margin-top: 50px;
          font-size: 0.8em;
          color: #666;
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <p><strong>${language === 'de' ? 'Datum' : 'Date'}:</strong> ${new Date().toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US')}</p>
  `;
  
  // Group fields by sections for better printing
  const sections = {
    personal: {
      title: language === 'de' ? 'Persönliche Daten' : 'Personal Information',
      fields: ['fullName', 'dateOfBirth', 'nationality', 'passportNumber', 'maritalStatus']
    },
    contact: {
      title: language === 'de' ? 'Kontaktdaten' : 'Contact Information',
      fields: ['currentAddress', 'phoneNumber', 'email', 'germanAddress', 'plannedArrival']
    },
    employment: {
      title: language === 'de' ? 'Beschäftigungsdaten' : 'Employment Information',
      fields: ['employerName', 'employerAddress', 'jobTitle', 'jobDescription', 'contractDuration', 'salary', 'workHours']
    },
    qualifications: {
      title: language === 'de' ? 'Qualifikationen' : 'Qualifications',
      fields: ['previousEmployment', 'qualifications', 'germanLevel']
    },
    additional: {
      title: language === 'de' ? 'Zusätzliche Informationen' : 'Additional Information',
      fields: ['criminalRecord', 'healthInsurance', 'accommodation', 'financialSupport']
    }
  };
  
  Object.values(sections).forEach(section => {
    htmlContent += `<div class="section"><h2>${section.title}</h2>`;
    
    section.fields.forEach(field => {
      if (data[field]) {
        const label = getFieldLabel(field, language);
        const value = data[field] || '-';
        htmlContent += `
          <div class="field">
            <span class="label">${label}:</span>
            <span class="value">${ensureSafeHTML(value)}</span>
          </div>
        `;
      }
    });
    
    htmlContent += '</div>';
  });
  
  htmlContent += `
      <div class="footer">
        <p>Generated by MIGSTART AI</p>
      </div>
    </body>
    </html>
  `;
  
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for content to load then print
  printWindow.onload = () => {
    printWindow.print();
  };
};