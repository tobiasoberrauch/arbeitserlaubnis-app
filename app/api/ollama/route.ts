import { NextRequest, NextResponse } from 'next/server';
import ollamaService from '@/lib/ollamaService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, model, language, temperature, stream } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Check if streaming is requested
    if (stream) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            await ollamaService.streamChat(
              messages,
              { model, language, temperature },
              (chunk) => {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`)
                );
              }
            );
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Non-streaming response
    const response = await ollamaService.chat(messages, {
      model,
      language,
      temperature
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Ollama API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const models = await ollamaService.listModels();
    const health = await ollamaService.checkHealth();
    
    return NextResponse.json({
      models,
      healthy: health,
      defaultModel: 'qwen2.5:7b'
    });
  } catch (error) {
    console.error('Ollama GET error:', error);
    return NextResponse.json(
      { error: 'Failed to get Ollama status' },
      { status: 500 }
    );
  }
}