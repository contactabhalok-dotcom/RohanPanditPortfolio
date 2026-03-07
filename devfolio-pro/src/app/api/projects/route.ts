import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { sampleProjects } from '@/lib/sample-data';

export async function GET() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    try {
        const { data: projects, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({
                status: 'success',
                results: sampleProjects.length,
                data: { projects: sampleProjects },
            });
        }

        return NextResponse.json({
            status: 'success',
            results: projects?.length || 0,
            data: {
                projects: (projects && projects.length > 0) ? projects : sampleProjects,
            },
        });
    } catch (error: any) {
        return NextResponse.json({
            status: 'success',
            results: sampleProjects.length,
            data: { projects: sampleProjects },
        });
    }
}

export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Please login first to add projects' }, { status: 401 });
        }

        const body = await req.json();
        const { data, error } = await supabase.from('projects').insert([body]).select().single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            status: 'success',
            data: { project: data },
        }, { status: 201 });
    } catch (error: any) {
        console.error('Server error:', error);
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}
