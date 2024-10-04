// app/api/projects/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import axios from 'axios';


export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

        // Check for empty request body
        const body = await request.json();
        if (!body) {
            return NextResponse.json({ error: 'Empty request body' }, { status: 400 });
        }

        const { name, description, referenceList, domains } = body; // Added domains

        // Validate input data
        if (!name || !description || !Array.isArray(referenceList) || !Array.isArray(domains)) { // Updated validation
            return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
        }

        // Check if the project exists and belongs to the user
        const project = await prisma.project.findUnique({
            where: { id: params.id },
        });

        console.log('Project found:', project); // Log the project details

        if (!project || project.userId !== user.id) {
            return NextResponse.json({ error: 'Project not found or unauthorized' }, { status: 404 });
        }

        // Update the project
        const updatedProject = await prisma.project.update({
            where: { id: params.id },
            data: {
                name,
                description,
                referenceList,
                domains: {
                    // Combine existing domains with new ones
                    push: domains, // Use push to add new domains
                },
            },
        });

        return NextResponse.json({ project: updatedProject }, { status: 200 });
    } catch (error: any) {
        console.error('Error updating project:', error); // Log the entire error object
        return NextResponse.json({ error: 'Failed to update project', details: error.message }, { status: 500 });
    }
}
