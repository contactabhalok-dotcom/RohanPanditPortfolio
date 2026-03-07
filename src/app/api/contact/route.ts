import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl || '', supabaseServiceKey || '');

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, subject, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Please provide name, email and message' }, { status: 400 });
        }

        if (!supabaseUrl || !supabaseServiceKey) {
            return NextResponse.json({
                status: 'success',
                message: 'Your message has been sent successfully! (Demo mode)',
            }, { status: 201 });
        }

        const { error } = await supabase.from('contact_messages').insert([{ name, email, subject, message }]);

        if (error) {
            console.error('Supabase insert error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            status: 'success',
            message: 'Your message has been sent successfully!',
            data: {
                contactMessage: body,
            },
        }, { status: 201 });
    } catch (error: any) {
        console.error('Contact form error:', error);
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const { data: messages, error } = await supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({
                status: 'success',
                results: 0,
                data: { messages: [] },
            });
        }

        return NextResponse.json({
            status: 'success',
            results: messages?.length || 0,
            data: {
                messages: messages || [],
            },
        });
    } catch (error: any) {
        return NextResponse.json({
            status: 'success',
            results: 0,
            data: { messages: [] },
        });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Message ID required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('contact_messages')
            .delete()
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ status: 'success' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}
