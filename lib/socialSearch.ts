// lib/socialSearch.ts

import fetch from 'node-fetch';

interface SearchResult {
    results: {
        content: string;              // The text content of the post or comment
        url: string;                  // URL to the post or comment
        author_name: string;          // Reddit username of the author
        author_id: string;            // Reddit ID of the author
        author_url: string;           // URL to the author's Reddit profile
        creation_date: string;        // Date and time when the post or comment was created
        subreddit_name: string;       // Name of the subreddit
        subreddit_url: string;        // URL to the subreddit
        subreddit_title: string;      // Title of the subreddit
        score: number;                // Upvote score of the post or comment
        nsfw: boolean;                // Whether the content is marked as NSFW
        content_language: string;     // Language of the content
        upvote_ratio?: number;        // (For posts) Upvote ratio of the post
        num_comments?: number;        // (For posts) Number of comments on the post
        content_type?: string;        // (For posts) Type of content (text, image, video, link)
        post_title?: string;          // (For comments) Title of the parent post
        post_url?: string;            // (For comments) URL to the parent post
    }[];
    query: string;                    // The search query used
    number_of_results: number;        // Number of results returned
}

// New interface for subreddit search results
interface SubredditSearchResult {
    results: {
        name: string;
        url: string;
        id: string;
        description: string;
        subscribers: number;
        nsfw: boolean;
        icon: string;
    }[];
    query: string;
    number_of_results: number;
}

// Rate Limiting Variables
let requestTimestamps: number[] = []; // Stores timestamps of API requests

// Rate Limiting Constants
const RATE_LIMIT = 30; // Maximum number of requests
const RATE_LIMIT_WINDOW = 60 * 1000; // Time window in milliseconds (60 seconds)

// Function to check if the rate limit has been exceeded
function isRateLimited(): boolean {
    const now = Date.now();

    // Remove timestamps older than the rate limit window
    requestTimestamps = requestTimestamps.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);

    if (requestTimestamps.length >= RATE_LIMIT) {
        // Rate limit exceeded
        return true;
    }

    // Add the current timestamp
    requestTimestamps.push(now);
    return false;
}

// Helper function to determine the content type of a Reddit post
function determineContentType(content: any): string {
    if (content.text) return 'text';
    if (content.image) return 'image';
    if (content.video) return 'video';
    if (content.link) return 'link';
    return 'unknown';
}

// Generic function to make API calls to Reddit with rate limiting
async function fetchFromRedditApi(endpoint: string, queryParams: URLSearchParams): Promise<any> {
    if (isRateLimited()) {
        // Rate limit exceeded
        throw new Error('Rate limit exceeded. Please try again in a minute.');
    }

    const url = `https://reddit-scraper2.p.rapidapi.com/${endpoint}`;

    // Make the API request
    const response = await fetch(`${url}?${queryParams}`, {
        method: 'GET',
        headers: {
            'x-rapidapi-host': 'reddit-scraper2.p.rapidapi.com',
            'x-rapidapi-key': process.env.RAPIDAPI_KEY || '',
        },
    });

    // Check if the response is successful
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Reddit API error (${response.status}): ${errorText}`);
        throw new Error(`Reddit API error: ${response.statusText}`);
    }

    // Parse and return the JSON response
    return await response.json();
}

// Function to search Reddit posts
export async function redditSearchPosts(query: string, desiredResults: number = 25): Promise<SearchResult> {
    let allResults: any[] = [];
    let cursor = '';
    let hasNextPage = true;

    // Loop until we have the desired number of valid results or no more pages
    while (allResults.length < desiredResults && hasNextPage) {
        // Build query parameters
        const queryParams = new URLSearchParams({
            query,
            sort: 'RELEVANCE',
            nsfw: '0',
            time: 'all',
        });

        if (cursor) {
            queryParams.append('cursor', cursor);
        }

        // Fetch data from the Reddit API
        const data = await fetchFromRedditApi('search_posts', queryParams);

        const pageInfo = data.pageInfo;
        hasNextPage = pageInfo?.hasNextPage || false;
        cursor = pageInfo?.endCursor || '';

        // Add the data to allResults
        allResults = allResults.concat(data.data);
    }

    // Map the API response to the desired format
    const posts = allResults.slice(0, desiredResults).map((item: any) => ({
        content: item.title || '', // For posts, content is the title
        url: item.url || '',
        author_name: item.author?.name || '',
        author_id: item.author?.id || '',
        author_url: item.author?.url || '',
        creation_date: item.creationDate || '',
        subreddit_name: item.subreddit?.name || '',
        subreddit_url: item.subreddit?.url || '',
        subreddit_title: item.subreddit?.title || '',
        score: item.score || 0,
        nsfw: item.nsfw || false,
        content_language: item.contentLanguage || '',
        upvote_ratio: item.upvoteRatio || 0,
        num_comments: item.comments || 0,
        content_type: determineContentType(item.content || {}),
    }));

    return {
        results: posts,
        query,
        number_of_results: posts.length,
    };
}

// Function to search Reddit comments
export async function redditSearchComments(query: string, desiredResults: number = 25): Promise<SearchResult> {
    let validComments: any[] = [];
    let cursor = '';
    let hasNextPage = true;

    // Loop until we have the desired number of valid results or no more pages
    while (validComments.length < desiredResults && hasNextPage) {
        // Build query parameters
        const queryParams = new URLSearchParams({
            query,
            sort: 'RELEVANCE',
            nsfw: '0',
        });

        if (cursor) {
            queryParams.append('cursor', cursor);
        }

        // Fetch data from the Reddit API
        const data = await fetchFromRedditApi('search_comments', queryParams);

        const pageInfo = data.pageInfo;
        hasNextPage = pageInfo?.hasNextPage || false;
        cursor = pageInfo?.endCursor || '';

        // Process each item
        for (const item of data.data) {
            if (validComments.length >= desiredResults) {
                break;
            }

            // Remove 't1_' prefix from the comment ID
            const commentId = item.id?.replace('t1_', '') || '';

            // Comment content
            const commentContent = item.text || ''; // Use item.text for the comment text

            // Comment author details
            const authorName = item.author?.name || '';
            const authorId = item.author?.id || '';
            const authorUrl = item.author?.url || '';
            const creationDate = item.creationDate || '';
            const commentScore = item.score || 0;
            const nsfw = item.nsfw || false;
            const contentLanguage = item.language || '';

            // Parent post details
            const parentPostUrl = item.post?.content?.link || ''; // Corrected path to the parent post URL
            const parentPostTitle = item.post?.title || ''; // Corrected path to the parent post title
            const subredditName = item.post?.subreddit?.name || ''; // Corrected path to subreddit info
            const subredditUrl = item.post?.subreddit?.url || '';
            const subredditTitle = item.post?.subreddit?.title || '';

            // Construct the full URL to the comment
            let commentUrl = '';
            if (parentPostUrl && commentId) {
                commentUrl = `${parentPostUrl}${commentId}/`;
            }

            // Validate the constructed URL
            if (!commentUrl.startsWith('https://www.reddit.com')) {
                continue; // Skip invalid URLs
            }

            // Add to valid comments
            validComments.push({
                content: commentContent,
                url: commentUrl,
                author_name: authorName,
                author_id: authorId,
                author_url: authorUrl,
                creation_date: creationDate,
                subreddit_name: subredditName,
                subreddit_url: subredditUrl,
                subreddit_title: subredditTitle,
                score: commentScore,
                nsfw: nsfw,
                content_language: contentLanguage,
                post_title: parentPostTitle,
                post_url: parentPostUrl,
            });
        }
    }

    return {
        results: validComments.slice(0, desiredResults),
        query,
        number_of_results: validComments.length,
    };
}

// New function to search for subreddits
export async function redditSearchSubreddits(query: string, desiredResults: number = 25, nsfw: boolean = false): Promise<SubredditSearchResult> {
    let allResults: any[] = [];
    let cursor = '';
    let hasNextPage = true;

    // Loop until we have the desired number of results or no more pages
    while (allResults.length < desiredResults && hasNextPage) {
        // Build query parameters
        const queryParams = new URLSearchParams({
            query,
            nsfw: nsfw ? '1' : '0',
        });

        if (cursor) {
            queryParams.append('cursor', cursor);
        }

        // Fetch data from the Reddit API
        const data = await fetchFromRedditApi('search_subs', queryParams);

        const pageInfo = data.pageInfo;
        hasNextPage = pageInfo?.hasNextPage || false;
        cursor = pageInfo?.endCursor || '';

        // Add the data to allResults
        allResults = allResults.concat(data.data);
    }

    // Map the API response to the desired format
    const subreddits = allResults.slice(0, desiredResults).map((item: any) => ({
        name: item.name || '',
        url: item.url || '',
        id: item.id || '',
        description: item.description || '',
        subscribers: item.subscribers || 0,
        nsfw: item.nsfw || false,
        icon: item.icon || '',
    }));

    return {
        results: subreddits,
        query,
        number_of_results: subreddits.length,
    };
}
