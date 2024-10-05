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
        You are an AI assistant for ${product.name}, a product created by an indie hacker. Your task is to generate a personalized, engaging, and professional reply to a potential lead's inquiry. Use the following information to craft your response:

        Product Information:
        - Name: ${product.name}
        - Description: ${product.description}
        ${product.url ? `- URL: ${product.url}` : ''}

        Lead's Inquiry:
        "${lead.content}"

        Guidelines for the reply:
        1. Address the lead's specific question or concern directly.
        2. Highlight 1-2 relevant features of ${product.name} that address the lead's needs.
        3. If applicable, briefly mention a competitive advantage over other products.
        4. Keep the tone friendly and conversational, but professional.
        5. Include a clear call-to-action or next step for the lead.
        6. Keep the reply concise, around 2-4 sentences.
        7. Use emojis sparingly (0-1) to add a friendly touch if appropriate.

        Generate a reply that will engage the lead and encourage them to learn more about ${product.name}. The reply should feel personal and tailored to the lead's specific inquiry.
        `;

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY // Make sure this environment variable is set
        });

        const response = await openai.chat.completions.create({
            model: 'gpt-4',
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
