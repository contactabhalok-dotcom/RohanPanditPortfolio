import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        return NextResponse.json({ error: 'Server configuration error - missing env vars' }, { status: 500 });
    }

    try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const formData = await req.formData();
        const file = formData.get('file') as File;
        const folder = formData.get('folder') as string || 'general';
        
        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;
        
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        const { data, error: uploadError } = await supabase.storage
            .from('portfolio')
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: true,
            });
        
        if (uploadError) {
            console.error('Upload error:', uploadError);
            return NextResponse.json({ error: uploadError.message }, { status: 500 });
        }
        
        const { data: urlData } = supabase.storage
            .from('portfolio')
            .getPublicUrl(filePath);
        
        return NextResponse.json({ url: urlData.publicUrl });
    } catch (error: any) {
        console.error('Server error:', error);
        return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
    }
}
