import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    const { password } = await request.json();

    // Simple check - in production use env var
    const validPassword = process.env.ADMIN_PASSWORD || 'admin';

    if (password === validPassword) {
        // Set cookie
        (await cookies()).set('admin_session', 'true', { httpOnly: true, path: '/' });
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
}
