import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from "@supabase/ssr";
import { updateSitemap, updateRSSFeed, generateMetadata } from '@/utils/seoUtils';

export async function GET(request: NextRequest) {
    const supabase = createServerClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!,
        { cookies: {} }
    );

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    console.log('API Route - Received request with:', { id, slug });

    try {
        if (slug) {
            console.log('Fetching blog post with slug:', slug);
            const { data: post, error } = await supabase
                .from('BlogPost')
                .select('*')
                .eq('slug', slug)
                .single();
            
            console.log('Supabase response:', { post, error });

            if (error) {
                console.error('Supabase error:', error);
                return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
            }

            if (!post) {
                console.log('No post found for slug:', slug);
                return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
            }

            return NextResponse.json(post);
        } else if (id) {
            // Fetch a single blog post by id
            const { data: post, error } = await supabase
                .from('BlogPost')
                .select('*')
                .eq('id', id)
                .single();
            
            if (error) {
                return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
            }

            return NextResponse.json(post);
        } else {
            // Fetch all blog posts ordered by createdAt, excluding full content
            const { data: blogPosts, error } = await supabase
                .from('BlogPost')
                .select('id, title, slug, excerpt, image, author, createdAt')
                .order('createdAt', { ascending: false });

            if (error) {
                throw error;
            }

            return NextResponse.json(blogPosts);
        }
    } catch (error) {
        console.error('Error fetching blog post(s):', error);
        return NextResponse.json({ error: 'Failed to fetch blog post(s)' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const supabase = createServerClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!,
        { cookies: {} }
    );

    try {
        const body = await request.json();
        const { title, slug, content, excerpt, image, author } = body;

        // Validate input data
        if (!title || !slug || !content || !excerpt || !author) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Create a new blog post
        const { data: newPost, error } = await supabase
            .from('BlogPost')
            .insert([
                { title, slug, content, excerpt, image, author }
            ])
            .select()
            .single();

        if (error) {
            if (error.code === '23505') { // Unique constraint violation
                return NextResponse.json({ error: 'Slug must be unique' }, { status: 400 });
            }
            throw error;
        }

        // Update SEO-related elements
        await Promise.all([
            updateSitemap(newPost),
            updateRSSFeed(newPost),
            generateMetadata(newPost),
        ]);

        return NextResponse.json(newPost, { status: 201 });
    } catch (error: any) {
        console.error('Error creating blog post:', error);
        return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
    }
}
