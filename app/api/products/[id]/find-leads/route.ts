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
        const startTime = Date.now();
        const timeLimit = 10000; // 10 seconds in milliseconds

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
        const resultsPerKeyword = Math.ceil(50 / keywords.length);

        const allLeads = [];
        let keywordIndex = 0;
        let batchSize = 10;

        while (Date.now() - startTime < timeLimit && allLeads.length < 50 && keywordIndex < keywords.length) {
            const keyword = keywords[keywordIndex];
            const remainingResults = resultsPerKeyword - (allLeads.length % resultsPerKeyword);
            const currentBatchSize = Math.min(batchSize, remainingResults);

            try {
                const [postResults, commentResults] = await Promise.all([
                    redditSearchPosts(keyword, Math.ceil(currentBatchSize / 2)),
                    redditSearchComments(keyword, Math.floor(currentBatchSize / 2)),
                ]);

                const batchLeads = [...postResults.results, ...commentResults.results].map(result => ({
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

                allLeads.push(...batchLeads);

                if (allLeads.length % resultsPerKeyword === 0) {
                    keywordIndex++;
                }
            } catch (error: any) {
                if (error.message.includes('Rate limit exceeded')) {
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
                } else {
                    throw error;
                }
            }
        }

        // Insert leads into the database
        const createdLeads = await prisma.lead.createMany({
            data: allLeads,
            skipDuplicates: true,
        });

        // Decrement remaining lead finds
        const { error: updateError } = await supabase
            .from('User')
            .update({ remaining_lead_finds: userData.remaining_lead_finds - 1 })
            .eq('user_id', userId);

        if (updateError) {
            console.error('Error updating remaining lead finds:', updateError);
        }

        return NextResponse.json({ leads: createdLeads.count, totalTime: Date.now() - startTime }, { status: 200 });

    } catch (error: any) {
        console.error('Error finding leads:', error);
        return NextResponse.json({ error: `Failed to find leads: ${error.message}` }, { status: 500 });
    }
}