import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (pathname === '/.well-known/assetlinks.json') {
        return NextResponse.rewrite(
            new URL('/.well-known/assetlinks.json', req.url),
        );
    }
}

export const config = {
    matcher: ['/.well-known/assetlinks.json'],
};
