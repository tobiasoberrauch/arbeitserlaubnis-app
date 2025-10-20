import { NextRequest, NextResponse } from 'next/server';
import germanAIFormService from '@/lib/germanAIFormService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    switch (action) {
      case 'nextQuestion': {
        const { context } = params;
        const response = await germanAIFormService.getNextQuestion(context);
        return NextResponse.json(response);
      }

      case 'validate': {
        const { fieldId, answer, language } = params;
        const validation = await germanAIFormService.validateAnswer(fieldId, answer, language);
        return NextResponse.json(validation);
      }

      case 'summary': {
        const { formData, language } = params;
        const summary = await germanAIFormService.generateSummary(formData, language);
        return NextResponse.json({ summary });
      }

      case 'help': {
        const { fieldId, language } = params;
        const help = await germanAIFormService.provideHelp(fieldId, language);
        return NextResponse.json({ help });
      }

      case 'translate': {
        const { formData, fromLang, toLang } = params;
        const translated = await germanAIFormService.translateForm(formData, fromLang, toLang);
        return NextResponse.json({ translated });
      }

      case 'languages': {
        const languages = germanAIFormService.getSupportedLanguages();
        return NextResponse.json({ languages });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('GermanAI Form API error:', error);
    return NextResponse.json(
      { error: 'Failed to process form request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
