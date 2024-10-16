import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '../../../../../lib/prisma'


export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { userId } = getAuth(request);

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { keywords } = await request.json();

        const product = await prisma.product.update({
            where: { id: parseInt(params.id) },
            data: { keywords: keywords.join(',') },
            include: { leads: true }, // Include leads in the response
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ product });
    } catch (error: any) {
        console.error('Error updating keywords:', error);
        return NextResponse.json({ error: 'Failed to update keywords' }, { status: 500 });
    }
}

