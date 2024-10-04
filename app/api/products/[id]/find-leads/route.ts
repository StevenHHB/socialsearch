import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { redditSearch } from '@/lib/redditSearch';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    const { userId } = getAuth(request);

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(params.id) },
            include: { user: true },
        });

        if (!product || product.user.user_id !== userId) {
            return NextResponse.json({ error: 'Product not found or unauthorized' }, { status: 404 });
        }

        // Check remaining lead finds
        const { data: userData, error: userError } = await supabase
            .from('User')
            .select('remaining_lead_finds')
            .eq('user_id', userId)
            .single();

        if (userError) {
            console.error('Supabase error fetching user data:', userError);
            return NextResponse.json({ error: `Failed to fetch user data: ${userError.message}` }, { status: 500 });
        }

        if (!userData) {
            console.error('User data not found for userId:', userId);
            return NextResponse.json({ error: 'User data not found' }, { status: 404 });
        }

        if (userData.remaining_lead_finds <= 0) {
            return NextResponse.json({ error: 'No remaining lead finds' }, { status: 403 });
        }

        const searchResults = await redditSearch(product.keywords);

        const leads = await Promise.all(searchResults.results.map(async (result) => {
            return prisma.lead.create({
                data: {
                    content: result.content,
                    url: result.url,
                    productId: product.id,
                },
            });
        }));

        // Decrement remaining lead finds
        const { error: updateError } = await supabase
            .from('user')
            .update({ remaining_lead_finds: userData.remaining_lead_finds - 1 })
            .eq('user_id', userId);

        if (updateError) {
            console.error('Error updating remaining lead finds:', updateError);
        }

        return NextResponse.json({ leads }, { status: 200 });
    } catch (error: any) {
        console.error('Error finding leads:', error);
        return NextResponse.json({ error: `Failed to find leads: ${error.message}` }, { status: 500 });
    }
}
