import { clerkMiddleware } from '@clerk/nextjs/server';

process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_Y2hhbXBpb24tbW91c2UtOTA2NS5jbGVyay5hY2NvdW50cy5kZXY';
process.env.CLERK_SECRET_KEY = 'sk_test_ZeIP2q9EK78Z4PeC2OhAmUH9IQMtqVyvHEJRUHcnl1';

export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};