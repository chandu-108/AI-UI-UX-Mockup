import { db } from '@/config/db';
import { userTable } from '@/config/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const users = await db.select().from(userTable).where(eq(userTable.email, userId));
    
    if (users.length === 0) {
      return NextResponse.json(null);
    }

    return NextResponse.json(users[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = body;

    if (!email) {
      return NextResponse.json({ error: 'email is required' }, { status: 400 });
    }

    const existingUsers = await db.select().from(userTable).where(eq(userTable.email, email));
    
    if (existingUsers.length > 0) {
      return NextResponse.json(existingUsers[0]);
    }

    const result = await db.insert(userTable).values({
      name,
      email,
      credits: 5,
    }).returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
