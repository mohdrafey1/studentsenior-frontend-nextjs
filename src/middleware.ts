import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // List of static file extensions to skip dynamic routing
    const staticFileExtensions = [
        '.webp',
        '.png',
        '.jpg',
        '.jpeg',
        '.gif',
        '.svg',
        '.ico',
        '.txt',
        '.xml',
        '.json',
        '.pdf',
        '.woff',
        '.woff2',
        '.ttf',
        '.eot',
        '.otf',
        '.css',
        '.js',
        '.map',
    ];

    // If it's a static file request, return 404 immediately if not in public folder
    // This prevents it from being processed by dynamic routes
    if (
        staticFileExtensions.some((ext) => pathname.toLowerCase().endsWith(ext))
    ) {
        // For favicon specifically, you might want to handle it differently
        if (pathname === '/favicon.webp' || pathname === '/favicon.png') {
            // Return 404 for non-existent favicons
            return new NextResponse(null, { status: 404 });
        }
        // Let other static files pass through normally
        return NextResponse.next();
    }

    return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - api routes
         */
        '/((?!_next/static|_next/image|api).*)',
    ],
};
