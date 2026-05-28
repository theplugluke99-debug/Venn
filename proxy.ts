import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/subscribe(.*)",
  "/solopreneur(.*)",
  // Prospect-facing public pages
  "/card/(.*)",
  "/cards/(.*)",
  "/proposal/(.*)",
  "/close/(.*)",
  "/reports/(.*)",
  // Public API routes (called by prospects, no auth)
  "/api/close/(.*)/answer",
  "/api/close/(.*)/complete",
  "/api/proposals/(.*)/questions",
  "/api/reports/(.*)/feedback",
  // Webhooks and system
  "/api/webhooks/(.*)",
  "/api/worker(.*)",
  "/api/solopreneur/apply(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
