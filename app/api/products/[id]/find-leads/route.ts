// routes/api/findLeads.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { redditSearchPosts, redditSearchComments } from '@/lib/socialSearch';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    const { userId } = getAuth(request);

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const productId = parseInt(params.id);
        const { action, keyword } = await request.json();

        if (action !== 'getNewestLeads' || !keyword) {
            return NextResponse.json({ error: 'Invalid action or missing keyword' }, { status: 400 });
        }

        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: { user: true },
        });

        if (!product || product.user.user_id !== userId) {
            return NextResponse.json({ error: 'Product not found or unauthorized' }, { status: 404 });
        }

        // Fetch user data
        const { data: userData, error: fetchError } = await supabase
            .from('User')
            .select('remaining_lead_finds')
            .eq('user_id', userId)
            .single();

        if (fetchError) {
            console.error('Error fetching user data:', fetchError);
            return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
        }

        if (userData.remaining_lead_finds <= 0) {
            return NextResponse.json({ error: 'No remaining lead finds' }, { status: 403 });
        }

        const [postResults, commentResults] = await Promise.all([
            redditSearchPosts(keyword, 25),
            redditSearchComments(keyword, 25)
        ]);

        const leads = postResults.results.concat(commentResults.results)
            .sort((a, b) => new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime())
            .slice(0, 50)
            .map(result => ({
                content: result.content,
                url: result.url,
                authorName: result.author_name,
                authorId: result.author_id,
                authorUrl: result.author_url,
                creationDate: new Date(result.creation_date),
                subredditName: result.subreddit_name,
                subredditUrl: result.subreddit_url,
                subredditTitle: result.subreddit_title,
                score: result.score,
                nsfw: result.nsfw,
                contentLanguage: result.content_language,
                upvoteRatio: result.upvote_ratio || 0,
                numComments: result.num_comments || 0,
                contentType: result.content_type || '',
                postTitle: 'post_title' in result ? result.post_title : result.content,
                postUrl: 'post_url' in result ? result.post_url : result.url,
                productId: product.id,
            }));

        // Insert leads into the database
        if (leads.length > 0) {
            await prisma.lead.createMany({
                data: leads,
                skipDuplicates: true,
            });
        }

        // Decrement remaining lead finds
        const { error: updateError } = await supabase
            .from('User')
            .update({ remaining_lead_finds: userData.remaining_lead_finds - 1 })
            .eq('user_id', userId);

        if (updateError) {
            console.error('Error updating remaining lead finds:', updateError);
        }

        return NextResponse.json({ leads: leads }, { status: 200 });

    } catch (error: any) {
        console.error('Error finding leads:', error);
        return NextResponse.json({ error: `Failed to find leads: ${error.message}`, partialResults: [] }, { status: 500 });
    }
}
