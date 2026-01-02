import { db } from '@/config/db';
import { projectTable, screenConfigTable } from '@/config/schema';
import { eq, desc } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');
    const userId = searchParams.get('userId');

    if (projectId) {
      const projects = await db.select().from(projectTable).where(eq(projectTable.projectId, projectId));
      
      if (projects.length === 0) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }

      const screens = await db.select().from(screenConfigTable).where(eq(screenConfigTable.projectId, projectId));
      
      return NextResponse.json({
        ...projects[0],
        screens,
      });
    }

    if (userId) {
      const projects = await db.select().from(projectTable)
        .where(eq(projectTable.userId, userId))
        .orderBy(desc(projectTable.createdOn));
      
      return NextResponse.json(projects);
    }

    return NextResponse.json({ error: 'projectId or userId is required' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, userInput, device, userId } = body;

    if (!projectId || !userInput || !device || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await db.insert(projectTable).values({
      projectId,
      userInput,
      device,
      userId,
      projectName: 'Untitled Project',
      theme: '',
    }).returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, projectName, theme, screenshot } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (projectName !== undefined) updateData.projectName = projectName;
    if (theme !== undefined) updateData.theme = theme;
    if (screenshot !== undefined) updateData.screenshot = screenshot;

    const result = await db.update(projectTable)
      .set(updateData)
      .where(eq(projectTable.projectId, projectId))
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}
