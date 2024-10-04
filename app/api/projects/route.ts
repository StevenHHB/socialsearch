// app/api/projects/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';


export async function GET(request: NextRequest) {
    const { userId } = getAuth(request);

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const maxRetries = 3;
    let retries = 0;

    while (retries < maxRetries) {
        try {
            const user = await prisma.user.findUnique({
                where: { user_id: userId },
            });

            if (!user) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            const projects = await prisma.project.findMany({
                where: { userId: user.id },
                orderBy: { createdAt: 'desc' },
            });

            return NextResponse.json({ projects }, { status: 200 });
        } catch (error: any) {
            retries++;
            if (retries >= maxRetries) {
                console.error('Error fetching projects:', error.message, error.stack);
                return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
            }
            // Wait for a short time before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

/*
export async function GET(request: NextRequest) {
    const { userId } = getAuth(request);

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await connectPrisma();

        console.log(`Searching for user with userId: ${userId}`);

        // Fetch the user from the database
        const user = await prisma.user.findUnique({
            where: { user_id: userId },
        });

        console.log('User found:', user);

        if (!user) {
            console.log(`User not found for Clerk userId: ${userId}`);
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const projects = await prisma.project.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
        });

        console.log(`Retrieved ${projects.length} projects for user ${userId}`);
        return NextResponse.json({ projects }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching projects:', error.message);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    } finally {
        await disconnectPrisma();
    }
}*/

export async function POST(request: NextRequest) {
    // Authenticate the user
    const { userId } = getAuth(request);

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {

        // Fetch the numeric userId from your user table
        const user = await prisma.user.findUnique({
            where: { user_id: userId },
            select: { id: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Parse the request body
        const { name, description, referenceList } = await request.json();

        // Validate input data
        if (!name || !description || !Array.isArray(referenceList)) {
            return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
        }

        // Create a new project
        const newProject = await prisma.project.create({
            data: {
                name,
                description,
                referenceList,
                userId: user.id,
            },
        });

        return NextResponse.json({ project: newProject }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating project:', error.message);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}
