import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    try {
        const { slug } = await params;
        const { data: blogPost, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }

        return NextResponse.json({
            status: 'success',
            data: {
                blogPost,
            },
        });
    } catch (error: any) {
        return NextResponse.json({ error: `Error: ${error.message}` }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    try {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { slug } = await params;
        const body = await req.json();
        const { error } = await supabase
            .from('blog_posts')
            .update(body)
            .eq('slug', slug);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            status: 'success',
            data: {
                blogPost: body,
            },
        });
    } catch (error: any) {
        return NextResponse.json({ error: `Error: ${error.message}` }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    try {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { slug } = await params;
        const { error } = await supabase
            .from('blog_posts')
            .delete()
            .eq('slug', slug);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ status: 'success' }, { status: 204 });
    } catch (error: any) {
        return NextResponse.json({ error: `Error: ${error.message}` }, { status: 500 });
    }
}
