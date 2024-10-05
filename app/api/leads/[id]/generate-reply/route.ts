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
            include: { product: { include: { user: true } } },
        });

        if (!lead) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        if (lead.product.user.user_id !== userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check remaining reply generations
        const { data: userData, error: userError } = await supabase
            .from('User')
            .select('remaining_reply_generations')
            .eq('user_id', userId)
            .single();

        if (userError || !userData) {
            return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
        }

        if (userData.remaining_reply_generations <= 0) {
            return NextResponse.json({ error: 'No remaining reply generations' }, { status: 403 });
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const prompt = `
        Generate a reply for the following lead content related to the product "${lead.product.name}":
        "${lead.content}"
        
        The reply should be engaging, professional, and tailored to the lead's content.
        `;

        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 150,
            temperature: 0.7,
        });

        const generatedReply = response.choices[0].message.content;

        const updatedLead = await prisma.lead.update({
            where: { id: leadId },
            data: { reply: generatedReply },
            include: { product: true }, // Add this line to include the product in the result
        });

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
