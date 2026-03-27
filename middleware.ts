// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Solo interceptar las rutas destinadas a n8n
    if (request.nextUrl.pathname.startsWith('/api/n8n/')) {
        const authHeader = request.headers.get('authorization');
        const apiKey = process.env.N8N_API_KEY;

        if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== apiKey) {
            return NextResponse.json(
                { error: 'Acceso no autorizado' },
                { status: 401 }
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/api/n8n/:path*',
};