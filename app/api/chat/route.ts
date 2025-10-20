import { NextRequest, NextResponse } from 'next/server';
import germanAIService from '@/lib/germanAIService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, language, model, temperature } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const response = await germanAIService.chat(messages, {
      language,
      model,
      temperature
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('GermanAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to get chat response', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
