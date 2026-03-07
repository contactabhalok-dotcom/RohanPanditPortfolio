import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl || '', supabaseServiceKey || '');

export async function GET() {
    try {
        const { data: projects, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({
                status: 'success',
                results: 0,
                data: { projects: [] },
            });
        }

        return NextResponse.json({
            status: 'success',
            results: projects?.length || 0,
            data: {
                projects: projects || [],
            },
        });
    } catch (error: any) {
        console.error('Server error:', error);
        return NextResponse.json({
            status: 'success',
            results: 0,
            data: { projects: [] },
        });
    }
}

export async function POST(req: NextRequest) {
    try {
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
