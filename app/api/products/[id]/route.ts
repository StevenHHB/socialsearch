import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

        const product = await prisma.product.findUnique({
            where: { 
                id: parseInt(params.id),
                userId: user.id
            },
            include: { leads: true },
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ product });
    } catch (error: any) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { userId } = getAuth(request);

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { name, description, keywords, url } = await request.json();

        const product = await prisma.product.update({
            where: { id: parseInt(params.id) },
            data: { name, description, keywords, url },
        });

        if (!product || product.userId !== parseInt(userId)) {
            return NextResponse.json({ error: 'Product not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json({ product });
    } catch (error: any) {
        console.error('Error updating product:', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const { userId } = getAuth(request);

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const product = await prisma.product.delete({
            where: { id: parseInt(params.id) },
        });

        if (!product || product.userId !== parseInt(userId)) {
            return NextResponse.json({ error: 'Product not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
