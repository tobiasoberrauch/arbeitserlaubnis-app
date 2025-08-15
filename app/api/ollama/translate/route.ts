import { NextRequest, NextResponse } from 'next/server';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

export async function POST(request: NextRequest) {
  try {
    const { values, fromLanguage, toLanguage } = await request.json();

    // Create a translation prompt
    const languageNames: { [key: string]: string } = {
      de: 'German',
      en: 'English', 
      tr: 'Turkish',
      ar: 'Arabic',
      pl: 'Polish',
      uk: 'Ukrainian',
      es: 'Spanish',
      fr: 'French'
    };

    const fromLang = languageNames[fromLanguage] || 'German';
    const toLang = languageNames[toLanguage] || 'English';

    // Skip translation if same language
    if (fromLanguage === toLanguage) {
      return NextResponse.json({ translatedValues: values });
    }

    // Fields that should not be translated (IDs, numbers, emails, etc.)
    const doNotTranslate = [
      'dateOfBirth',
      'passportNumber', 
      'phoneNumber',
      'email',
      'salary',
      'workHours',
      'plannedArrival',
      'nationality',
      'maritalStatus',
      'germanLevel',
      'criminalRecord'
    ];

    const translatedValues: any = {};

    // Process each field
    for (const [key, value] of Object.entries(values)) {
      // Skip empty values or non-translateable fields
      if (!value || doNotTranslate.includes(key)) {
        translatedValues[key] = value;
        continue;
      }

      // For longer text fields, use Ollama for translation
      if (typeof value === 'string' && value.length > 20) {
        try {
          const prompt = `Translate the following text from ${fromLang} to ${toLang}. 
Only return the translation, nothing else.
Keep the same format and structure.
If the text contains addresses, keep street names but translate descriptive parts.

Text to translate:
${value}`;

          const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'qwen2.5:7b',
              prompt: prompt,
              stream: false,
              options: {
                temperature: 0.3,
                max_tokens: 500
              }
            })
          });

          if (response.ok) {
            const data = await response.json();
            translatedValues[key] = data.response.trim();
          } else {
            translatedValues[key] = value; // Keep original if translation fails
          }
        } catch (error) {
          console.error(`Translation error for field ${key}:`, error);
          translatedValues[key] = value;
        }
      } else {
        // For short values, use simple translations or keep as is
        translatedValues[key] = value;
      }
    }

    // Special handling for certain fields with predefined translations
    if (values.maritalStatus) {
      const maritalStatusTranslations: any = {
        single: { de: 'ledig', en: 'single', tr: 'bekar', ar: 'أعزب', pl: 'kawaler', uk: 'неодружений', es: 'soltero', fr: 'célibataire' },
        married: { de: 'verheiratet', en: 'married', tr: 'evli', ar: 'متزوج', pl: 'żonaty', uk: 'одружений', es: 'casado', fr: 'marié' },
        divorced: { de: 'geschieden', en: 'divorced', tr: 'boşanmış', ar: 'مطلق', pl: 'rozwiedziony', uk: 'розлучений', es: 'divorciado', fr: 'divorcé' },
        widowed: { de: 'verwitwet', en: 'widowed', tr: 'dul', ar: 'أرمل', pl: 'wdowiec', uk: 'вдівець', es: 'viudo', fr: 'veuf' }
      };

      // Find the key for the current value
      for (const [statusKey, translations] of Object.entries(maritalStatusTranslations)) {
        if (Object.values(translations).includes(values.maritalStatus)) {
          translatedValues.maritalStatus = translations[toLanguage] || values.maritalStatus;
          break;
        }
      }
    }

    if (values.criminalRecord) {
      const yesNoTranslations: any = {
        yes: { de: 'ja', en: 'yes', tr: 'evet', ar: 'نعم', pl: 'tak', uk: 'так', es: 'sí', fr: 'oui' },
        no: { de: 'nein', en: 'no', tr: 'hayır', ar: 'لا', pl: 'nie', uk: 'ні', es: 'no', fr: 'non' }
      };

      // Find the key for the current value
      for (const [key, translations] of Object.entries(yesNoTranslations)) {
        if (Object.values(translations).includes(values.criminalRecord.toLowerCase())) {
          translatedValues.criminalRecord = translations[toLanguage] || values.criminalRecord;
          break;
        }
      }
    }

    return NextResponse.json({ 
      translatedValues,
      fromLanguage,
      toLanguage
    });

  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Translation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}