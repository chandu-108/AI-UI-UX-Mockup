import { db } from '@/config/db';
import { screenConfigTable } from '@/config/schema';
import { openrouter } from '@/config/openrouter';
import { getEditScreenPrompt } from '@/data/prompts';
import { eq, and } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, screenId, userInput, currentCode } = body;

    if (!projectId || !screenId || !userInput || !currentCode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const systemPrompt = getEditScreenPrompt();
    const userPrompt = `
Old code:
${currentCode}

User changes requested:
${userInput}

Apply the requested changes while maintaining the design consistency.`;

    const response = await openrouter.chat.completions.create({
      model: "openai/gpt-4o",
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
    console.error('Error editing screen:', error);
    return NextResponse.json({ error: 'Failed to edit screen' }, { status: 500 });
  }
}
