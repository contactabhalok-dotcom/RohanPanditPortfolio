import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    try {
        const { id } = await params;
        const { data: project, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }

        return NextResponse.json({
            status: 'success',
            data: {
                project,
            },
        });
    } catch (error: any) {
        return NextResponse.json({ error: `Error: ${error.message}` }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    try {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { error } = await supabase
            .from('projects')
            .update(body)
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            status: 'success',
            data: {
                project: body,
            },
        });
    } catch (error: any) {
        return NextResponse.json({ error: `Error: ${error.message}` }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    try {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ status: 'success' }, { status: 204 });
    } catch (error: any) {
        return NextResponse.json({ error: `Error: ${error.message}` }, { status: 500 });
    }
}
