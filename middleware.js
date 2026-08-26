import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
  publishableKey: 'pk_test_Y2hhbXBpb24tbW91c2UtOTA2NS5jbGVyay5hY2NvdW50cy5kZXY',
  secretKey: 'sk_test_ZeIP2q9EK78Z4PeC2OhAmUH9IQMtqVyvHEJRUHcnl1',
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};