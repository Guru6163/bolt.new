import { NextRequest, NextResponse } from 'next/server';
import { ModelService } from '@/lib/modelService';
import { BASE_PROMPT } from '@/lib/prompts';
import { basePrompt as nodeBasePrompt } from '@/lib/defaults/node';
import { basePrompt as reactBasePrompt } from '@/lib/defaults/react';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: true, message: 'Prompt is required' },
        { status: 400 }
      );
    }

    const answer = await ModelService.classifyProject(prompt);
    
    if (answer === "react") {
      return NextResponse.json({
        prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
        uiPrompts: [reactBasePrompt]
      });
    }

    if (answer === "node") {
      return NextResponse.json({
        prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
        uiPrompts: [nodeBasePrompt]
      });
    }

    return NextResponse.json(
      { error: true, message: 'Invalid project type' },
      { status: 403 }
    );
  } catch (error: any) {
    console.error("Error in /api/template endpoint:", error);
    return NextResponse.json(
      {
        error: true,
        message: error.message || "An error occurred while processing your request"
      },
      { status: 500 }
    );
  }
}
