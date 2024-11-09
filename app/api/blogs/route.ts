import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from "@supabase/ssr";
import { updateSitemap, updateRSSFeed, generateMetadata, generateBlogJsonLd } from '@/utils/seoUtils';
import { revalidatePath } from 'next/cache';

// Add API key validation middleware
const validateApiKey = (request: NextRequest) => {
  const apiKey = request.headers.get('x-api-key');
  const validApiKey = process.env.BLOG_API_KEY;
  
  if (!apiKey || apiKey !== validApiKey) {
    return false;
  }
  return true;
};

export async function GET(request: NextRequest) {
    const supabase = createServerClient(
        process.env.BLOG_SUPABASE_URL!,
        process.env.BLOG_SUPABASE_SERVICE_KEY!,
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
                .from('posts')
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
                .from('posts')
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
                .from('posts')
                .select('id, title, slug, excerpt, image, author, published_at')
                .eq('project_id', process.env.SEO_ENGINE_PROJECT_KEY!) 
                .eq('status', 'published')
                .order('published_at', { ascending: false });
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
    // Add API key validation
    if (!validateApiKey(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();

        console.log(`Blog post received: ${body.blog_post}`)
        const { id, title, slug, content, excerpt, image, author } = body.blog_post;
        console.log(title)
        // Validate input data
        if (!title || !slug || !content || !excerpt || !author) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Update SEO-related content
        await Promise.all([
            updateSitemap(body),
            updateRSSFeed()
        ]);

        return NextResponse.json(body, { status: 201 });
    } catch (error) {
        console.error('Error creating blog post:', error);
        return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
    }
}
