import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { redditSearchSubreddits } from '../../../../lib/socialSearch';

// Rate limiting variables
let requestCount = 0;
let lastResetTime = Date.now();
const RATE_LIMIT = 30;
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

export async function POST(request: NextRequest) {
    const { userId } = getAuth(request);

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check rate limit
    const now = Date.now();
    if (now - lastResetTime > RATE_LIMIT_WINDOW) {
        requestCount = 0;
        lastResetTime = now;
    }

    if (requestCount >= RATE_LIMIT) {
        return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
    }

    requestCount++;

    try {
        const { keyword, nsfw } = await request.json();

        if (!keyword) {
            return NextResponse.json({ error: 'Missing keyword' }, { status: 400 });
        }

        const subreddits = await redditSearchSubreddits(keyword, 25, nsfw);

        return NextResponse.json(subreddits, { status: 200 });

    } catch (error: any) {
        console.error('Error finding subreddits:', error);
        return NextResponse.json({ error: `Failed to find subreddits: ${error.message}` }, { status: 500 });
    }
}

