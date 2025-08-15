import { Ollama } from 'ollama';

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

class OllamaFormService {
  private ollama: Ollama;
  private defaultModel: string = 'qwen2.5:7b';
  
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
    this.ollama = new Ollama({
      host: process.env.OLLAMA_HOST || 'http://localhost:11434'
    });
  }

  private getSystemPrompt(language: string): string {
    const langName = this.languageNames[language] || this.languageNames['en'];
    
    return `You are a professional assistant helping users complete work permit (Arbeitserlaubnis) applications for Germany.
    
CRITICAL INSTRUCTIONS:
1. ALWAYS respond in ${langName} language exclusively
2. Ask ONE question at a time for work permit application
3. Be professional but friendly
4. Provide examples when helpful
5. Validate user input and ask for clarification if needed
6. Guide users through the entire application process step by step
7. Use clear, simple language that non-native speakers can understand
8. For dates use format: DD.MM.YYYY
9. For addresses include: Street, House Number, Postal Code, City, Country
10. Always maintain context of previous answers

Current language: ${langName}
Response language: MUST be in ${langName} only

You are collecting information for these fields in order:
1. Full Name (as in passport)
2. Date of Birth
3. Nationality
4. Passport Number
5. Current Address (complete)
6. Phone Number (with country code)
7. Email Address
8. Marital Status
9. Planned German Address (if known)
10. Planned Arrival Date in Germany
11. Employer Name in Germany
12. Employer Address in Germany
13. Job Title/Position
14. Job Description (brief)
15. Contract Duration
16. Monthly Salary (in EUR)
17. Work Hours per Week
18. Previous Employment (last 3 years)
19. Educational Qualifications
20. German Language Level (A1-C2 or None)
21. Criminal Record Declaration (Yes/No)
22. Health Insurance Plans
23. Accommodation in Germany (if arranged)
24. Financial Support/Sponsors

Remember: ONLY respond in ${langName}!`;
  }

  async getNextQuestion(context: FormContext): Promise<FormResponse> {
    try {
      const language = context.language || 'de';
      const currentFieldIndex = context.currentStep || 0;
      const fieldId = this.formFields[currentFieldIndex];
      
      const systemPrompt = this.getSystemPrompt(language);
      
      // Build context from previous answers
      let contextInfo = 'Previous information collected:\n';
      context.fields?.forEach((field) => {
        if (field.value) {
          contextInfo += `- ${field.id}: ${field.value}\n`;
        }
      });

      const prompt = `${contextInfo}\n\nNow ask for: ${fieldId}\n\nProvide:
1. A clear question for this field
2. 2-3 helpful examples
3. Any important notes or requirements
4. Format everything in ${this.languageNames[language]}`;

      const response = await this.ollama.chat({
        model: this.defaultModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        options: {
          temperature: 0.3, // Lower temperature for consistent form questions
        }
      });

      // Parse the response to extract structured data
      const questionText = response.message.content;
      
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
      
      const prompt = `Validate this answer for ${fieldId}:
Answer: "${answer}"

Check if the answer is:
1. Complete and properly formatted
2. Realistic and valid
3. Suitable for an official application

If invalid, explain what's wrong in ${this.languageNames[language]}.
If valid but needs formatting, provide the corrected format.

Respond in JSON format:
{
  "valid": true/false,
  "message": "explanation in ${this.languageNames[language]}",
  "correctedValue": "corrected value if needed"
}`;

      const response = await this.ollama.chat({
        model: this.defaultModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        options: {
          temperature: 0.1, // Very low temperature for validation
        }
      });

      try {
        return JSON.parse(response.message.content);
      } catch {
        // Fallback if JSON parsing fails
        return {
          valid: true,
          message: response.message.content
        };
      }
    } catch (error) {
      console.error('Error validating answer:', error);
      return { valid: true }; // Default to valid if error
    }
  }

  async generateSummary(formData: any, language: string): Promise<string> {
    try {
      const systemPrompt = this.getSystemPrompt(language);
      
      const prompt = `Generate a professional summary of this work permit application in ${this.languageNames[language]}:

${JSON.stringify(formData, null, 2)}

Create a well-formatted summary that:
1. Groups related information together
2. Highlights key details
3. Is ready for official submission
4. Uses proper formatting with sections

MUST be in ${this.languageNames[language]} language only!`;

      const response = await this.ollama.chat({
        model: this.defaultModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        options: {
          temperature: 0.2,
        }
      });

      return response.message.content;
    } catch (error) {
      console.error('Error generating summary:', error);
      throw error;
    }
  }

  async translateForm(formData: any, fromLang: string, toLang: string): Promise<any> {
    try {
      const prompt = `Translate this work permit application from ${this.languageNames[fromLang]} to ${this.languageNames[toLang]}:

${JSON.stringify(formData, null, 2)}

Maintain all formatting, dates, numbers, and proper nouns.
Only translate the text content.
Return as JSON.`;

      const response = await this.ollama.chat({
        model: this.defaultModel,
        messages: [
          { role: 'system', content: 'You are a professional translator for official documents.' },
          { role: 'user', content: prompt }
        ],
        options: {
          temperature: 0.1,
        }
      });

      try {
        return JSON.parse(response.message.content);
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
      
      const prompt = `Provide detailed help for filling out the ${fieldId} field in a German work permit application.
      
Include:
1. What information is needed
2. Common mistakes to avoid
3. Tips for this field
4. Examples of correct format

Response MUST be in ${this.languageNames[language]} only!`;

      const response = await this.ollama.chat({
        model: this.defaultModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        options: {
          temperature: 0.3,
        }
      });

      return response.message.content;
    } catch (error) {
      console.error('Error providing help:', error);
      throw error;
    }
  }

  private extractExamples(text: string): string[] {
    // Simple extraction logic - can be improved
    const lines = text.split('\n');
    const examples: string[] = [];
    
    lines.forEach(line => {
      if (line.includes('example') || line.includes('Beispiel') || line.includes('e.g.') || line.includes('z.B.')) {
        const cleanExample = line.replace(/^[^:]*:/, '').trim();
        if (cleanExample) examples.push(cleanExample);
      }
    });
    
    return examples.slice(0, 3); // Return max 3 examples
  }

  private extractHelpText(text: string): string {
    // Extract helpful notes or requirements
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

export default new OllamaFormService();