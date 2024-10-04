// app/api/projects/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import axios from 'axios';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id'); // Changed from slug to id

    if (id) {
        // Fetch a single blog post by id
        const { data: post, error } = await supabase
            .from('BlogPost')
            .select('*')
            .eq('id', id) // Updated to match on id
            .single();

        if (error) {
            throw new Error(error.message);
        }
        return NextResponse.json(post);
    } else {
        // Fetch all blog posts ordered by createdAt
        const { data: blogPosts, error } = await supabase
            .from('BlogPost')
            .select('*')
            .order('createdAt', { ascending: false });

        if (error) {
            throw new Error(error.message);
        }

        return NextResponse.json(blogPosts);
    }
}

export async function POST(request: NextRequest) {
    try {
        // Check for empty request body
        const body = await request.json();
        if (!body) {
            return NextResponse.json({ error: 'Empty request body' }, { status: 400 });
        }

        const { title, slug, content, image } = body;

        // Validate input data
        if (!title || !slug || !content) {
            return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
        }

        // Create a new blog post in Supabase
        const { data: newPost, error } = await supabase
            .from('BlogPost')
            .insert([{ title, slug, content, image }]);

        if (error) {
            throw new Error(error.message);
        }

        return NextResponse.json({ post: newPost }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating blog post:', error);
        return NextResponse.json({ error: 'Failed to create blog post', details: error.message }, { status: 500 });
    }
}
