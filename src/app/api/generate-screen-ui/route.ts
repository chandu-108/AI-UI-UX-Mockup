import { db } from '@/config/db';
import { screenConfigTable } from '@/config/schema';
import { openrouter } from '@/config/openrouter';
import { getGenerateScreenPrompt } from '@/data/prompts';
import { eq, and } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, screenId, screenName, purpose, screenDescription, deviceType, projectVisualDescription } = body;

    if (!projectId || !screenId || !screenName || !deviceType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const systemPrompt = getGenerateScreenPrompt(deviceType);
    const userPrompt = `
Screen details:
- Name: ${screenName}
- Purpose: ${purpose}
- Description: ${screenDescription}
${projectVisualDescription ? `\nProject Visual Style: ${projectVisualDescription}` : ''}

Generate the HTML body content for this screen.`;

    const response = await openrouter.chat.completions.create({
      model: "anthropic/claude-3-haiku",
      max_tokens: 4000,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    let cleanContent = content.trim();
    if (cleanContent.startsWith('```html')) {
      cleanContent = cleanContent.slice(7);
    }
    if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.slice(3);
    }
    if (cleanContent.endsWith('```')) {
      cleanContent = cleanContent.slice(0, -3);
    }
    cleanContent = cleanContent.trim();

    await db.update(screenConfigTable)
      .set({ code: cleanContent })
      .where(and(
        eq(screenConfigTable.projectId, projectId),
        eq(screenConfigTable.screenId, screenId)
      ));

    return NextResponse.json({ code: cleanContent });
  } catch (error) {
    console.error('Error generating screen UI:', error);
    return NextResponse.json({ error: 'Failed to generate screen UI' }, { status: 500 });
  }
}
