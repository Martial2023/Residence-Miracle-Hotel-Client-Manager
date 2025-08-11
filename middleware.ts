import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';
import { apiAuthPrefix, AUTH_ROUTES, PUBLIC_ROUTES } from './routes';


export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const sessionCookie = getSessionCookie(req);

    // 1. Autoriser les routes publiques ou celles qui commencent par l'API d'auth
    if (pathname.startsWith(apiAuthPrefix) || PUBLIC_ROUTES.includes(pathname)) {
        return NextResponse.next();
    }
    // 4. Autoriser l'accès aux pages de type /post/[postId] même si l'utilisateur n'est pas connecté
    const postPageRegex = /^\/menu\/[^\/]+$/;
    const clientOrderRegex = /^\/menu\/[^\/]+\/client-order$/;
    if (postPageRegex.test(pathname) || clientOrderRegex.test(pathname)) {
        return NextResponse.next();
    }

    // 2. Si l'utilisateur est déjà connecté et tente d'accéder à une route d'auth, on le redirige
    if (AUTH_ROUTES.includes(pathname) && sessionCookie) {
        return NextResponse.redirect(new URL('/onboarding', req.url));
    }

    // 3. Si l'utilisateur n'est pas connecté et tente d'accéder à une route privée
    if (!sessionCookie && !AUTH_ROUTES.includes(pathname)) {
        return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};