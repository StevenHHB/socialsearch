// lib/redditSearch.ts
import fetch from 'node-fetch';

type SearchResult = {
    results: {
        title: string;
        url: string;
        content: string;
        thumbnail: string;
    }[];
    query: string;
    images: string[];
    number_of_results: number;
};

export async function redditSearch(
    query: string,
    maxResults: number = 10
): Promise<SearchResult> {
    const url = 'https://reddit-scraper2.p.rapidapi.com/search_posts';
    const queryParams = new URLSearchParams({
        query: query,
        // Add other optional parameters if needed
        // sort: 'RELEVANCE',
        // time: 'all',
        // nsfw: '0',
    });

    const response = await fetch(`${url}?${queryParams}`, {
        method: 'GET',
        headers: {
            'x-rapidapi-host': 'reddit-scraper2.p.rapidapi.com',
            'x-rapidapi-key': process.env.RAPIDAPI_KEY || '',
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Reddit API error (${response.status}): ${errorText}`);
        throw new Error(`Reddit API error: ${response.statusText}`);
    }

    const data = await response.json() as { data: any[] };

    const posts = data.data.slice(0, maxResults).map((item: any) => ({
        title: item.title,
        url: item.url,
        content: typeof item.content === 'string' ? item.content.slice(0, 500) : '',
        thumbnail: '', // API response doesn't include thumbnail, so we'll leave it empty
    }));

    return {
        results: posts,
        query,
        images: [],
        number_of_results: posts.length,
    };
}
