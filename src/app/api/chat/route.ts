import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();
        
        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
        }
        
        const GROQ_API_KEY = process.env.GROQ_API_KEY;
        
        if (!GROQ_API_KEY) {
            return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 });
        }
        
        const systemMessage = {
            role: 'system',
            content: `You are a helpful AI assistant representing Rohan Pandit's portfolio. You have knowledge about Rohan's skills, projects, blog posts, and can answer questions about him. 
            
            About Rohan:
            - He is a full-stack developer from West Bengal, India
            - His email is rohanpandityy35@gmail.com
            - Phone: +91 6290351365
            - He works with technologies like React, Next.js, TypeScript, Node.js, MongoDB, PostgreSQL, Tailwind CSS, and more
            - He builds web applications and shares knowledge through blog posts
            - You can help visitors learn more about Rohan's work and guide them to contact him at rohanpandityy35@gmail.com
            
            Be friendly, professional, and helpful. If you don't know something specific, suggest the visitor to check the portfolio or contact Rohan directly.`
        };
        
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [systemMessage, ...messages],
                temperature: 0.7,
                max_tokens: 1024,
            }),
        });
        
        if (!response.ok) {
            const error = await response.text();
            console.error('Groq API error:', error);
            return NextResponse.json({ error: 'Failed to get response from AI' }, { status: 500 });
        }
        
        const data = await response.json();
        
        return NextResponse.json({ 
            message: data.choices[0]?.message?.content || 'No response' 
        });
    } catch (error: any) {
        console.error('Chat error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
