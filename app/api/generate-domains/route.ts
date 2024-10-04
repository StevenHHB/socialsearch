import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import OpenAI from 'openai';
import { isAuthorized } from '@/utils/data/user/isAuthorized';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    const { userId } = getAuth(request);

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Remove subscription check
    // const { authorized } = await isAuthorized(userId);
    // if (!authorized) {
    //     return NextResponse.json({ error: 'No generations left' }, { status: 403 });
    // }

    try {


        // Fetch current remaining generations
        const { data: userData, error: fetchError } = await supabase
            .from('user') // Changed from 'users' to 'user'
            .select('remaining_generations')
            .eq('user_id', userId)
            .single(); // Fetch a single record

        if (fetchError) {
            console.error('Error fetching user data:', fetchError); // Debug log
            return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
        }

        console.log('Fetched user data:', userData); // Debug log
        const remainingGenerations = userData?.remaining_generations ?? 0;
        console.log('Current remaining generations:', remainingGenerations); // Debug log
        // Check if remaining generations are 0 and return an error
        if (remainingGenerations <= 0) {
            return NextResponse.json({ error: 'No remaining generations to use' }, { status: 403 });
        }
        console.log('Remaining generations:', remainingGenerations); // Debug log

        // Move OpenAI request here
        const { description, examples } = await request.json();

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const prompt = `
        Generate 20 creative, brandable, and short .com domain names based on the following product description: "${description}". 
        Use the examples as inspiration: ${examples.join(', ')}.
        Provide the domain names as a list without any numbering or additional text.
        Example:
        {
           ["Taskify.com", "FlowTask.com", ...]
        }
`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 150,
            n: 1,
            temperature: 0.8,
        });

        const generatedText = response.choices[0].message.content;
        const domainSuggestions = generatedText
            ?.split(',')
            .map((name) => name.trim())
            .filter((name) => name !== '');

        console.log('Generated domains:', domainSuggestions);
        // Decrement remaining generations

        // Update remaining generations by decrementing by 1
        const { error } = await supabase
            .from('user') // Changed from 'users' to 'user'
            .update({ remaining_generations: remainingGenerations - 1 })
            .eq('user_id', userId);

        if (error) {
            console.error('Error updating remaining generations:', error); // Debug log
        } else {
            console.log('Remaining generations decremented successfully.'); // Debug log
        }

        return NextResponse.json({ domainSuggestions });
    } catch (error: any) {
        console.error('Error generating domains:', error);
        return NextResponse.json({ error: 'Failed to generate domains' }, { status: 500 });
    }
}