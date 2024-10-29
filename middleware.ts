import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    // Public paths that don't require authentication
    const publicPaths = ['/'];
    
    // Check if the current path is public
    const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

    // If no token and trying to access protected route (like dashboard)
    if (!token && !isPublicPath) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // If has token and trying to access login page, redirect to dashboard
    if (token && isPublicPath) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
