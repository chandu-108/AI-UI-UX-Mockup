import { db } from '@/config/db';
import { projectTable, screenConfigTable } from '@/config/schema';
import { openrouter } from '@/config/openrouter';
import { getGenerateConfigPrompt } from '@/data/prompts';
import { eq, and } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userInput, deviceType, projectId, theme, projectVisualDescription } = body;

    if (!userInput || !deviceType || !projectId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const systemPrompt = getGenerateConfigPrompt(deviceType);

    const response = await openrouter.chat.completions.create({
      model: "anthropic/claude-3-haiku",
      max_tokens: 4000,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userInput }
      ],
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    let cleanContent = content.trim();
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.slice(7);
    }
    if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.slice(3);
    }
    if (cleanContent.endsWith('```')) {
      cleanContent = cleanContent.slice(0, -3);
    }
    cleanContent = cleanContent.trim();

    // Remove actual newlines that aren't within quoted strings
    // This is a safer approach - just try to parse and if it fails, clean up newlines within JSON strings
    let config;
    try {
      config = JSON.parse(cleanContent);
    } catch (error) {
      // If parsing fails, try removing actual newlines within the content
      // but preserve escaped sequences
      cleanContent = cleanContent.split('\n').map(line => line.trim()).join('');
      try {
        config = JSON.parse(cleanContent);
      } catch (innerError) {
        console.error('JSON parsing error:', innerError, 'Content:', cleanContent.substring(0, 500));
        return NextResponse.json({ error: 'Invalid JSON response from AI' }, { status: 500 });
      }
    }

    await db.update(projectTable)
      .set({
        projectName: config.projectName,
        theme: theme || config.theme,
        projectVisualDescription: projectVisualDescription || config.projectVisualDescription,
      })
      .where(eq(projectTable.projectId, projectId));

    for (const screen of config.screens) {
      await db.insert(screenConfigTable).values({
        projectId,
        screenId: screen.screenId || uuidv4(),
        screenName: screen.name,
        purpose: screen.purpose,
        screenDescription: screen.layoutDescription,
      });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error generating config:', error);
    return NextResponse.json({ error: 'Failed to generate config' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');
    const screenId = searchParams.get('screenId');

    if (!projectId || !screenId) {
      return NextResponse.json({ error: 'projectId and screenId are required' }, { status: 400 });
    }

    await db.delete(screenConfigTable)
      .where(and(
        eq(screenConfigTable.projectId, projectId),
        eq(screenConfigTable.screenId, screenId)
      ));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting screen:', error);
    return NextResponse.json({ error: 'Failed to delete screen' }, { status: 500 });
  }
}
