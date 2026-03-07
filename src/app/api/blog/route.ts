import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export async function GET() {
    try {
        const { data: blogPosts, error } = await supabase
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({
                status: 'success',
                results: 0,
                data: { blogPosts: [] },
            });
        }

        return NextResponse.json({
            status: 'success',
            results: blogPosts?.length || 0,
            data: {
                blogPosts: blogPosts || [],
            },
        });
    } catch (error: any) {
        return NextResponse.json({
            status: 'success',
            results: 0,
            data: { blogPosts: [] },
        });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { data, error } = await supabase.from('blog_posts').insert([body]).select().single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            status: 'success',
            data: { blogPost: data },
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}
