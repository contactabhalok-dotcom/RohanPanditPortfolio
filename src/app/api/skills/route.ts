import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { sampleSkills } from '@/lib/sample-data';

export async function GET() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    try {
        const { data: skills, error } = await supabase
            .from('skills')
            .select('*')
            .order('proficiency', { ascending: false });

        if (error) {
            return NextResponse.json({
                status: 'success',
                results: sampleSkills.length,
                data: { skills: sampleSkills },
            });
        }

        return NextResponse.json({
            status: 'success',
            results: skills?.length || 0,
            data: {
                skills: (skills && skills.length > 0) ? skills : sampleSkills,
            },
        });
    } catch (error: any) {
        return NextResponse.json({
            status: 'success',
            results: sampleSkills.length,
            data: { skills: sampleSkills },
        });
    }
}

export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Please login first to add skills' }, { status: 401 });
        }

        const body = await req.json();
        const { data, error } = await supabase.from('skills').insert([body]).select().single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            status: 'success',
            data: { skill: data },
        }, { status: 201 });
    } catch (error: any) {
        console.error('Server error:', error);
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}
