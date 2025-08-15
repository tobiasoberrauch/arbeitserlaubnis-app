import { NextRequest, NextResponse } from 'next/server';
import ollamaFormService from '@/lib/ollamaFormService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    switch (action) {
      case 'nextQuestion': {
        const { context } = params;
        const response = await ollamaFormService.getNextQuestion(context);
        return NextResponse.json(response);
      }

      case 'validate': {
        const { fieldId, answer, language } = params;
        const validation = await ollamaFormService.validateAnswer(fieldId, answer, language);
        return NextResponse.json(validation);
      }

      case 'summary': {
        const { formData, language } = params;
        const summary = await ollamaFormService.generateSummary(formData, language);
        return NextResponse.json({ summary });
      }

      case 'help': {
        const { fieldId, language } = params;
        const help = await ollamaFormService.provideHelp(fieldId, language);
        return NextResponse.json({ help });
      }

      case 'translate': {
        const { formData, fromLang, toLang } = params;
        const translated = await ollamaFormService.translateForm(formData, fromLang, toLang);
        return NextResponse.json({ translated });
      }

      case 'languages': {
        const languages = ollamaFormService.getSupportedLanguages();
        return NextResponse.json({ languages });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Ollama Form API error:', error);
    return NextResponse.json(
      { error: 'Failed to process form request' },
      { status: 500 }
    );
  }
}