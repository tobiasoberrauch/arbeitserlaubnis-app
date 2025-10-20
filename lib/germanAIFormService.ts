/**
 * GermanAI Form Service
 * Specialized service for work permit form processing with GermanAI.tech API
 */

export interface FormField {
  id: string;
  value: string;
  validated: boolean;
}

export interface FormContext {
  language: string;
  currentStep: number;
  totalSteps: number;
  fields: FormField[];
  userInfo: any;
}

export interface FormResponse {
  question: string;
  fieldId: string;
  validation?: string;
  examples?: string[];
  helpText?: string;
}

class GermanAIFormService {
  private apiUrl: string;
  private apiKey: string;
  private defaultModel: string;

  private formFields = [
    'fullName', 'dateOfBirth', 'nationality', 'passportNumber',
    'currentAddress', 'phoneNumber', 'email', 'maritalStatus',
    'germanAddress', 'plannedArrival', 'employerName', 'employerAddress',
    'jobTitle', 'jobDescription', 'contractDuration', 'salary',
    'workHoursPerWeek', 'previousEmployment', 'qualifications', 'germanLevel',
    'criminalRecord', 'healthInsurance', 'accommodation', 'financialSupport'
  ];

  private languageNames: { [key: string]: string } = {
    de: 'Deutsch',
    en: 'English',
    tr: 'Türkçe',
    ar: 'العربية',
    pl: 'Polski',
    uk: 'Українська',
    es: 'Español',
    fr: 'Français',
    ru: 'Русский',
    it: 'Italiano',
    pt: 'Português',
    zh: '中文',
    ja: '日本語',
    ko: '한국어',
    hi: 'हिन्दी',
    fa: 'فارسی',
    ur: 'اردو',
    bn: 'বাংলা',
    vi: 'Tiếng Việt',
    th: 'ไทย',
    ro: 'Română',
    hu: 'Magyar',
    cs: 'Čeština',
    nl: 'Nederlands',
    sv: 'Svenska',
    el: 'Ελληνικά'
  };

  constructor() {
    this.apiUrl = process.env.GERMANAI_API_URL || 'https://germanai.tech/api/v1/chat/completions';
    this.apiKey = process.env.GERMANAI_API_KEY || '';
    this.defaultModel = process.env.GERMANAI_MODEL || 'qwen3:32b';

    if (!this.apiKey) {
      console.warn('⚠️ GERMANAI_API_KEY not set in environment');
    }
  }

  private getSystemPrompt(language: string): string {
    const langName = this.languageNames[language] || this.languageNames['en'];

    return `Du bist ein professioneller Assistent für Arbeitserlaubnis-Anträge (work permit applications) in Deutschland.

KRITISCHE ANWEISUNGEN:
1. Antworte IMMER ausschließlich in ${langName}
2. Stelle EINE Frage nach der anderen für den Arbeitserlaubnisantrag
3. Sei professionell aber freundlich
4. Gib Beispiele wenn hilfreich
5. Validiere Benutzereingaben und bitte um Klarstellung wenn nötig
6. Führe Benutzer Schritt für Schritt durch den gesamten Antragsprozess
7. Verwende klare, einfache Sprache die Nicht-Muttersprachler verstehen können
8. Für Datum: Format DD.MM.YYYY
9. Für Adressen: Straße, Hausnummer, Postleitzahl, Stadt, Land
10. Behalte IMMER den Kontext vorheriger Antworten

Aktuelle Sprache: ${langName}
Antwort-Sprache: MUSS in ${langName} sein

Du sammelst Informationen für diese Felder in Reihenfolge:
1. Vollständiger Name (wie im Pass)
2. Geburtsdatum
3. Staatsangehörigkeit
4. Passnummer
5. Aktuelle Adresse (vollständig)
6. Telefonnummer (mit Ländervorwahl)
7. E-Mail-Adresse
8. Familienstand
9. Geplante Adresse in Deutschland (falls bekannt)
10. Geplantes Anreisedatum nach Deutschland
11. Arbeitgebername in Deutschland
12. Arbeitgeberadresse in Deutschland
13. Jobbezeichnung/Position
14. Jobbeschreibung (kurz)
15. Vertragslaufzeit
16. Monatsgehalt (in EUR)
17. Arbeitsstunden pro Woche
18. Frühere Beschäftigung (letzte 3 Jahre)
19. Bildungsabschlüsse
20. Deutschkenntnisse (A1-C2 oder Keine)
21. Führungszeugnis (Ja/Nein)
22. Krankenversicherungspläne
23. Unterkunft in Deutschland (falls organisiert)
24. Finanzielle Unterstützung/Sponsoren

Denk dran: Antworte NUR in ${langName}!`;
  }

  async getNextQuestion(context: FormContext): Promise<FormResponse> {
    try {
      const language = context.language || 'de';
      const currentFieldIndex = context.currentStep || 0;
      const fieldId = this.formFields[currentFieldIndex];

      const systemPrompt = this.getSystemPrompt(language);

      // Build context from previous answers
      let contextInfo = 'Bisher gesammelte Informationen:\n';
      context.fields?.forEach((field) => {
        if (field.value) {
          contextInfo += `- ${field.id}: ${field.value}\n`;
        }
      });

      const prompt = `${contextInfo}\n\nFrage jetzt nach: ${fieldId}\n\nGib an:
1. Eine klare Frage für dieses Feld
2. 2-3 hilfreiche Beispiele
3. Wichtige Hinweise oder Anforderungen
4. Formatiere alles in ${this.languageNames[language]}`;

      const response = await this.callGermanAI({
        model: this.defaultModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3 // Lower temperature for consistent form questions
      });

      const questionText = response.choices[0].message.content;

      return {
        question: questionText,
        fieldId: fieldId,
        examples: this.extractExamples(questionText),
        helpText: this.extractHelpText(questionText)
      };
    } catch (error) {
      console.error('Error getting next question:', error);
      throw error;
    }
  }

  async validateAnswer(
    fieldId: string,
    answer: string,
    language: string
  ): Promise<{ valid: boolean; message?: string; correctedValue?: string }> {
    try {
      const systemPrompt = this.getSystemPrompt(language);

      const prompt = `Validiere diese Antwort für ${fieldId}:
Antwort: "${answer}"

Prüfe ob die Antwort:
1. Vollständig und korrekt formatiert ist
2. Realistisch und gültig ist
3. Für einen offiziellen Antrag geeignet ist

Wenn ungültig, erkläre was falsch ist in ${this.languageNames[language]}.
Wenn gültig aber Formatierung nötig, gib das korrigierte Format an.

Antworte im JSON Format:
{
  "valid": true/false,
  "message": "Erklärung in ${this.languageNames[language]}",
  "correctedValue": "korrigierter Wert falls nötig"
}`;

      const response = await this.callGermanAI({
        model: this.defaultModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1, // Very low temperature for validation
        response_format: { type: 'json_object' }
      });

      try {
        // Clean the response - remove markdown code blocks if present
        let cleanedContent = response.choices[0].message.content.trim();

        // Remove markdown code blocks
        cleanedContent = cleanedContent.replace(/^```(?:json)?\n?/i, '');
        cleanedContent = cleanedContent.replace(/\n?```$/i, '');
        cleanedContent = cleanedContent.trim();

        const parsed = JSON.parse(cleanedContent);

        // Ensure valid is a boolean
        if (typeof parsed.valid !== 'boolean') {
          parsed.valid = parsed.valid === 'true' || parsed.valid === true;
        }

        return parsed;
      } catch (parseError) {
        console.warn('Failed to parse validation response as JSON:', response.choices[0].message.content);
        console.warn('Parse error:', parseError);

        // Try to detect if the response indicates validity
        const content = response.choices[0].message.content.toLowerCase();
        const isValid = !content.includes('invalid') &&
                       !content.includes('incorrect') &&
                       !content.includes('wrong') &&
                       !content.includes('fehler') &&
                       !content.includes('falsch');

        return {
          valid: isValid,
          message: response.choices[0].message.content
        };
      }
    } catch (error) {
      console.error('Error validating answer:', error);
      console.error('Field:', fieldId, 'Answer:', answer, 'Language:', language);

      // If there's a connection error, still allow progression
      if (error instanceof Error && (error.message.includes('fetch failed') || error.message.includes('GermanAI'))) {
        console.error('⚠️ GermanAI connection error - allowing answer to proceed');
      }

      return {
        valid: true,
        message: 'Validation skipped due to error - answer accepted'
      };
    }
  }

  async generateSummary(formData: any, language: string): Promise<string> {
    try {
      const systemPrompt = this.getSystemPrompt(language);

      const prompt = `Erstelle eine professionelle Zusammenfassung dieses Arbeitserlaubnis-Antrags in ${this.languageNames[language]}:

${JSON.stringify(formData, null, 2)}

Erstelle eine gut formatierte Zusammenfassung die:
1. Verwandte Informationen gruppiert
2. Wichtige Details hervorhebt
3. Für die offizielle Einreichung bereit ist
4. Korrekte Formatierung mit Abschnitten verwendet

MUSS in ${this.languageNames[language]} Sprache sein!`;

      const response = await this.callGermanAI({
        model: this.defaultModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating summary:', error);
      throw error;
    }
  }

  async translateForm(formData: any, fromLang: string, toLang: string): Promise<any> {
    try {
      const prompt = `Übersetze diesen Arbeitserlaubnis-Antrag von ${this.languageNames[fromLang]} zu ${this.languageNames[toLang]}:

${JSON.stringify(formData, null, 2)}

Behalte alle Formatierungen, Daten, Zahlen und Eigennamen bei.
Übersetze nur den Text-Inhalt.
Gib als JSON zurück.`;

      const response = await this.callGermanAI({
        model: this.defaultModel,
        messages: [
          { role: 'system', content: 'Du bist ein professioneller Übersetzer für offizielle Dokumente.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' }
      });

      try {
        return JSON.parse(response.choices[0].message.content);
      } catch {
        return formData; // Return original if parsing fails
      }
    } catch (error) {
      console.error('Error translating form:', error);
      return formData;
    }
  }

  async provideHelp(fieldId: string, language: string): Promise<string> {
    try {
      const systemPrompt = this.getSystemPrompt(language);

      const prompt = `Gib detaillierte Hilfe für das Ausfüllen des ${fieldId} Feldes in einem deutschen Arbeitserlaubnisantrag.

Beinhalte:
1. Welche Informationen benötigt werden
2. Häufige Fehler die vermieden werden sollten
3. Tipps für dieses Feld
4. Beispiele für das korrekte Format

Antwort MUSS in ${this.languageNames[language]} sein!`;

      const response = await this.callGermanAI({
        model: this.defaultModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error providing help:', error);
      throw error;
    }
  }

  private async callGermanAI(payload: any): Promise<any> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GermanAI API error:', response.status, errorText);
      throw new Error(`GermanAI API error: ${response.status}`);
    }

    return await response.json();
  }

  private extractExamples(text: string): string[] {
    const lines = text.split('\n');
    const examples: string[] = [];

    lines.forEach(line => {
      if (line.includes('example') || line.includes('Beispiel') || line.includes('e.g.') || line.includes('z.B.')) {
        const cleanExample = line.replace(/^[^:]*:/, '').trim();
        if (cleanExample) examples.push(cleanExample);
      }
    });

    return examples.slice(0, 3);
  }

  private extractHelpText(text: string): string {
    const lines = text.split('\n');
    const helpLines = lines.filter(line =>
      line.includes('Note') ||
      line.includes('Important') ||
      line.includes('Hinweis') ||
      line.includes('Wichtig')
    );

    return helpLines.join(' ').trim();
  }

  getSupportedLanguages(): string[] {
    return Object.keys(this.languageNames);
  }

  getLanguageName(code: string): string {
    return this.languageNames[code] || code;
  }
}

export default new GermanAIFormService();
