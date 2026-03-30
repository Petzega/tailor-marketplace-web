import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define la ruta que Clerk debe proteger
const isAdminRoute = createRouteMatcher(['/ame-studio-ops(.*)']);

export default clerkMiddleware(async (auth, req) => {
    // 1. Protección de Clerk para el panel
    if (isAdminRoute(req)) {
        await auth.protect();
    }

    // 2. Tu lógica existente para n8n
    if (req.nextUrl.pathname.startsWith('/api/n8n/')) {
        const authHeader = req.headers.get('authorization');
        const apiKey = process.env.N8N_API_KEY;

        if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== apiKey) {
            return NextResponse.json(
                { error: 'Acceso no autorizado' },
                { status: 401 }
            );
        }
    }
});

// Matcher requerido por Clerk
export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
};