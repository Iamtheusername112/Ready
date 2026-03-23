import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/stripe/webhook(.*)",
  "/.well-known(.*)",
]);

function clerkConfigured(): boolean {
  return Boolean(
    process.env.CLERK_SECRET_KEY?.trim() && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim()
  );
}

export default clerkMiddleware(async (auth, req) => {
  // Avoid Edge middleware failures on CORS preflight (e.g. some API clients).
  if (req.method === "OPTIONS") {
    return NextResponse.next();
  }

  // Do not wrap auth.protect() in try/catch — it uses Next.js redirects (thrown), which must propagate.
  if (!isPublicRoute(req)) {
    if (!clerkConfigured()) {
      console.error(
        "[middleware] Missing CLERK_SECRET_KEY or NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY. Add both in Vercel → Project → Settings → Environment Variables (Production + Preview)."
      );
      return new NextResponse(
        "Server configuration error: Clerk keys are not set. Add CLERK_SECRET_KEY and NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY in Vercel environment variables.",
        { status: 503 }
      );
    }
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
