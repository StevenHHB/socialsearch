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

        // Fetch the product and verify ownership
        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: { user: true },
        });

        if (!product || product.user.user_id !== userId) {
            return NextResponse.json({ error: 'Product not found or unauthorized' }, { status: 404 });
        }

        // Check remaining lead finds from Supabase
        const { data: userData, error: userError } = await supabase
            .from('User')
            .select('remaining_lead_finds')
            .eq('user_id', userId)
            .single();

        if (userError || !userData) {
            console.error('Supabase error fetching user data:', userError);
            return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
        }

        if (userData.remaining_lead_finds <= 0) {
            return NextResponse.json({ error: 'No remaining lead finds' }, { status: 403 });
        }

        // Split keywords and determine the number of results per keyword
        const keywords = product.keywords.split(',').map(k => k.trim()).filter(k => k);
        const resultsPerKeyword = Math.floor(50 / keywords.length);
        const postsPerKeyword = Math.ceil(resultsPerKeyword / 2);
        const commentsPerKeyword = resultsPerKeyword - postsPerKeyword;

        // Call the Reddit search functions for each keyword
        const allPostResults = [];
        const allCommentResults = [];

        for (const keyword of keywords) {
            try {
                const [postResults, commentResults] = await Promise.all([
                    redditSearchPosts(keyword, postsPerKeyword),
                    redditSearchComments(keyword, commentsPerKeyword),
                ]);
                allPostResults.push(...postResults.results);
                allCommentResults.push(...commentResults.results);
            } catch (error: any) {
                if (error.message.includes('Rate limit exceeded')) {
                    return NextResponse.json({ error: 'Rate limit exceeded. Please try again in a minute.' }, { status: 429 });
                } else {
                    throw error;
                }
            }
        }

        // Prepare the leads data
        const leadsData = [
            ...allPostResults.map((result) => ({
                content: result.content, // For posts, content is the title
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
                postTitle: result.content, // For posts, content is the title
                postUrl: result.url,
                productId: product.id,
            })),
            ...allCommentResults.map((result) => ({
                content: result.content, // For comments, content is the text
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
                postTitle: result.post_title,
                postUrl: result.post_url,
                productId: product.id,
            })),
        ];

        // Insert leads into the database
        const createdLeads = [];
        for (const leadData of leadsData) {
            const lead = await prisma.lead.create({
                data: leadData,
            });
            createdLeads.push(lead);
        }

        // Decrement remaining lead finds
        const { error: updateError } = await supabase
            .from('User')
            .update({ remaining_lead_finds: userData.remaining_lead_finds - 1 })
            .eq('user_id', userId);

        if (updateError) {
            console.error('Error updating remaining lead finds:', updateError);
        }

        return NextResponse.json({ leads: createdLeads }, { status: 200 });

    } catch (error: any) {
        console.error('Error finding leads:', error);
        return NextResponse.json({ error: `Failed to find leads: ${error.message}` }, { status: 500 });
    }
}
