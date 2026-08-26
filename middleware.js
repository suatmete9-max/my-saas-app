import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
  publishableKey: 'pk_test_Y2hhbXBpb24tbW91c2UtOTA2NS5jbGVyay5hY2NvdW50cy5kZXYk',
  secretKey: process.env.CLERK_SECRET_KEY,
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};