import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define which routes require authentication
const isProtectedRoute = createRouteMatcher(["/api/articles(.*)"]);

// Webhook routes should not require authentication (they use their own verification)
const isWebhookRoute = createRouteMatcher(["/api/webhook(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Skip auth for webhook routes
  if (isWebhookRoute(req)) {
    return;
  }

  // Protect API routes that need authentication
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
