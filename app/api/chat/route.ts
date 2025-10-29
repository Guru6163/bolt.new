import { NextRequest, NextResponse } from 'next/server';
import { ModelService } from '@/lib/modelService';
import { getSystemPrompt } from '@/lib/prompts';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: true, message: 'Messages array is required' },
        { status: 400 }
      );
    }

    const response = await ModelService.generateResponse(
      messages,
      getSystemPrompt(),
      8000
    );

    console.log(`Response generated using ${response.model}`);

    return NextResponse.json({
      response: response.content
    });
  } catch (error: any) {
    console.error("Error in /api/chat endpoint:", error);
    return NextResponse.json(
      {
        error: true,
        message: error.message || "An error occurred while processing your request"
      },
      { status: 500 }
    );
  }
}
