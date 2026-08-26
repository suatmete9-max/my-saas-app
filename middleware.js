import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Yeh batata hai ki /dashboard wala route secure/protected hai
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};