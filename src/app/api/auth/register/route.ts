import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabase-admin';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Please provide name, email and password' }, { status: 400 });
        }

        if (!supabaseUrl || !supabaseAnonKey) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        const { data: { user }, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                },
            },
        });

        if (signUpError) {
            return NextResponse.json({ error: signUpError.message }, { status: signUpError.status || 500 });
        }
        
        if (!user) {
            return NextResponse.json({ error: 'User not created' }, { status: 500 });
        }

        const { error: insertError } = await supabaseAdmin
            .from('users')
            .insert([{ id: user.id, name, email, role: 'admin' }]);

        if (insertError) {
            await supabaseAdmin.auth.admin.deleteUser(user.id);
            return NextResponse.json({ error: insertError.message }, { status: 500 });
        }

        return NextResponse.json({
            status: 'success',
            data: {
                user,
            },
        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: `Error: ${error.message}` }, { status: 500 });
    }
}
