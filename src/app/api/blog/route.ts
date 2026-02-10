import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { sampleBlogPosts } from '@/lib/sample-data';

export async function GET() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    try {
        const { data: blogPosts, error } = await supabase
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({
                status: 'success',
                results: sampleBlogPosts.length,
                data: { blogPosts: sampleBlogPosts },
            });
        }

        return NextResponse.json({
            status: 'success',
            results: blogPosts?.length || 0,
            data: {
                blogPosts: (blogPosts && blogPosts.length > 0) ? blogPosts : sampleBlogPosts,
            },
        });
    } catch (error: any) {
        return NextResponse.json({
            status: 'success',
            results: sampleBlogPosts.length,
            data: { blogPosts: sampleBlogPosts },
        });
    }
}

export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Please login first to add blog posts' }, { status: 401 });
        }

        const body = await req.json();
        const { data, error } = await supabase.from('blog_posts').insert([body]).select().single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            status: 'success',
            data: { blogPost: data },
        }, { status: 201 });
    } catch (error: any) {
        console.error('Server error:', error);
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}
