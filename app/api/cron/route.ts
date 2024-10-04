import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import axios from 'axios';
import { supabase } from '@/lib/supabase';

// API keys and environment variables
const openaiApiKey = process.env.OPENAI_API_KEY;
const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY;
const godaddyApiKey = process.env.GODADDY_API_KEY;
const godaddyApiSecret = process.env.GODADDY_API_SECRET;

// Function to add a random delay between 0 and 12 hours (in milliseconds)
function getRandomDelay() {
    const minDelay = 0; // 0 milliseconds (no delay)
    const maxDelay = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
    return Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
}

export async function GET(request: NextRequest) {
    // Authorization check
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Add random delay
    const delay = getRandomDelay();
    console.log(`Delaying blog post generation by ${delay / 1000 / 60} minutes`);
    await new Promise((resolve) => setTimeout(resolve, delay));

    try {
        // Set up OpenAI API client
        const openai = new OpenAI({
            apiKey: openaiApiKey,
        });

        // Step 1: Generate a dynamic SEO-friendly title first
        const titlePrompt = `
        Generate only one creative, SEO-optimized blog post title for a blog that of a product that helps users find the best available .com domains for their projects.
        Make sure the titles include relevant keywords and are enticing enough to generate high traffic.

        Here are some example title ideas for inspiration:
- 'How to Leverage .com Domains for Maximum Brand Recognition'
- '5 Expert Strategies for Finding the Perfect Domain Name'
- 'Why Every Business Needs a Great .com Domain and How to Get One'
- 'Uncovering Hidden .com Domain Gems: A Guide to Smart Acquisition'
Only return the title, nothing else.
        `;
        
        let generatedTitle;
        try {
            const openaiTitleResponse = await openai.chat.completions.create({
                model: 'gpt-4',
                messages: [{ role: 'user', content: titlePrompt }],
                max_tokens: 50,
                temperature: 0.7,
            });
            generatedTitle = openaiTitleResponse.choices[0]?.message?.content?.trim() || 'Default Title';
        } catch (error: any) {
            console.error('Error generating title with OpenAI:', error);
            return NextResponse.json({ error: 'Failed to generate title', details: error.message }, { status: 500 });
        }

        // Create slug from title
        const slug = generatedTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        // Step 2: Generate the blog content based on the title
        const contentPrompt = `
        Generate a blog post titled "${generatedTitle}" using markdown syntax. 
        Make sure the content is engaging, SEO-friendly, and includes actionable tips about finding and purchasing the best .com domains.
        Use headers, bullet points, and real-world examples. The post should attract readers interested in domain name acquisition, branding, and online businesses.
        `;
        
        let generatedContent: string;
        try {
            const openaiContentResponse = await openai.chat.completions.create({
                model: 'gpt-4',
                messages: [{ role: 'user', content: contentPrompt }],
                max_tokens: 1500,
                temperature: 0.7,
            });
            generatedContent = openaiContentResponse.choices[0].message.content || 'Default Content';
        } catch (error: any) {
            console.error('Error generating content with OpenAI:', error);
            return NextResponse.json({ error: 'Failed to generate content', details: error.message }, { status: 500 });
        }

        if (!generatedContent) {
            throw new Error('Failed to generate content: OpenAI response was empty');
        }

        // Step 3: Fetch an image from Unsplash based on the content
        const searchTerm = 'domain'; // you can enhance this based on the content later
        let imageUrl;
        try {
            const unsplashResponse = await axios.get(`https://api.unsplash.com/photos/random`, {
                params: {
                    query: searchTerm,
                },
                headers: {
                    Authorization: `Client-ID ${unsplashApiKey}`,
                },
            });
            imageUrl = unsplashResponse.data.urls.regular;
        } catch (error: any) {
            console.error('Error fetching image from Unsplash:', error);
            return NextResponse.json({ error: 'Failed to fetch image', details: error.message }, { status: 500 });
        }


        // Step 5: Insert blog post into the database
        // Fetch the current highest ID
        const { data: maxIdResult, error: maxIdError } = await supabase
            .from('BlogPost')
            .select('id')
            .order('id', { ascending: false })
            .limit(1);

        if (maxIdError) {
            console.error('Error fetching max ID:', maxIdError);
            throw new Error(`Failed to fetch max ID: ${maxIdError.message}`);
        }

        // Calculate the next ID
        const nextId = maxIdResult && maxIdResult.length > 0
            ? (parseInt(maxIdResult[0].id) + 1).toString()
            : '1';

        // Insert the new blog post
        const { data: newPost, error: insertError } = await supabase
            .from('BlogPost')
            .insert([
                { 
                    id: nextId,
                    title: generatedTitle, 
                    slug: slug,
                    content: generatedContent, 
                    image: imageUrl,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ])
            .select();

        if (insertError) {
            console.error('Error inserting blog post:', insertError);
            throw new Error(`Failed to insert blog post: ${insertError.message}`);
        }

        console.log('Successfully inserted blog post:', newPost[0]);

        // Return the successful blog post creation result
        return NextResponse.json({ post: newPost[0] }, { status: 201 });
    } catch (error: any) {
        console.error('Error in blog post generation process:', error);
        return NextResponse.json({ error: 'Failed to generate or insert blog post', details: error.message }, { status: 500 });
    }
}
