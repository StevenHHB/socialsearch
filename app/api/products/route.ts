import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    const { userId } = getAuth(request);

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // First, find the user in your database
        const user = await prisma.user.findUnique({
            where: { user_id: userId },
            select: { id: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Now use the user's numeric ID to fetch products
        const products = await prisma.product.findMany({
            where: { userId: user.id },
            include: { leads: true },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ products });
    } catch (error: any) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const { userId } = getAuth(request);

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { name, description, keywords, url } = await request.json();

        // First, find the user in your database
        const user = await prisma.user.findUnique({
            where: { user_id: userId },
            select: { id: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                keywords,
                url,
                userId: user.id, // Use the numeric ID from your database
            },
        });

        return NextResponse.json({ product }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
