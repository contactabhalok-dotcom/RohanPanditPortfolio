import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    try {
        const body = await req.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Please provide name, email and password' }, { status: 400 });
        }

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
