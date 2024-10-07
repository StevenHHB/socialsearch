import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    const { userId } = getAuth(request);

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const leadId = params.id; // Use the id directly as a string

        const lead = await prisma.lead.findUnique({
            where: { id: leadId },
            include: { 
                product: {
                    include: { user: true }
                }
            },
        });

        if (!lead) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        if (lead.product.user.user_id !== userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch additional product details
        const product = await prisma.product.findUnique({
            where: { id: lead.productId },
            select: {
                name: true,
                description: true,
                url: true,
            },
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const prompt = `
        You found this potential social media post/reply that could be a potential lead for ${product.name}. 
        Social Media Post/Reply of Potential Lead:
        "${lead.content}"

        Your are to respone to under the social media comment section. Here are the information about the product/service:
        - Name: ${product.name}
        - Description: ${product.description}
        ${product.url ? `- URL: ${product.url}` : ''}


        Suggestions:
        1. Address the lead's specific question or concern directly.
        2. Find a real and smart way to mention ${product.name} that address the lead's question or concern.
        3. Keep the reply concise, around 2-4 sentences.
        4. Use emojis sparingly (0-1) to add a friendly touch if appropriate.

        Reply with only the reply itself. It should not feel like any straight up promption / sales pitch yet also finding a way to either increase brand awareness or drive traffic.
        `;

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY // Make sure this environment variable is set
        });

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 250,
            temperature: 0.7,
        });

        const generatedReply = response.choices[0].message.content;

        const updatedLead = await prisma.lead.update({
            where: { id: leadId },
            data: { reply: generatedReply },
            include: { product: true }, // Add this line to include the product in the result
        });

        // Fetch user data
        const { data: userData, error: fetchError } = await supabase
            .from('User')
            .select('remaining_reply_generations')
            .eq('user_id', userId)
            .single();

        if (fetchError) {
            console.error('Error fetching user data:', fetchError);
            return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
        }

        // Decrement remaining reply generations
        const { error: updateError } = await supabase
            .from('User')
            .update({ remaining_reply_generations: userData.remaining_reply_generations - 1 })
            .eq('user_id', userId);

        if (updateError) {
            console.error('Error updating remaining reply generations:', updateError);
        }

        return NextResponse.json({ lead: updatedLead }, { status: 200 });
    } catch (error: any) {
        console.error('Error generating reply:', error.message);
        return NextResponse.json({ error: 'Failed to generate reply' }, { status: 500 });
    }
}
